-- ==========================================
-- PHASE 1: User Profiles & Auth Handling
-- ==========================================

-- Create a table for public profiles (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  address_line1 text,
  city text,
  state text,
  pincode text,
  updated_at timestamp with time zone
);

alter table profiles enable row level security;

create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication error on re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- PHASE 2: Persistent Cart
-- ==========================================

create table if not exists cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1 check (quantity > 0),
  size text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id, size) -- Prevent duplicates
);

alter table cart_items enable row level security;

create policy "Users can view their own cart" on cart_items
  for select using (auth.uid() = user_id);

create policy "Users can insert into their own cart" on cart_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cart" on cart_items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own cart items" on cart_items
  for delete using (auth.uid() = user_id);


-- ==========================================
-- PHASE 3: Orders & Transactions
-- ==========================================

-- Enum for Order Status
create type order_status as enum ('pending_payment', 'paid', 'failed', 'shipped', 'delivered', 'cancelled');

create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  razorpay_order_id text unique, -- The ID from Razorpay
  razorpay_payment_id text,      -- Filled after success
  status order_status default 'pending_payment',
  total_amount numeric not null, -- Snapshot of total cost
  shipping_address jsonb,        -- Snapshot of address
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);

-- Order Items (Snapshot of what was bought)
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id), -- Nullable in case product is deleted later? Ideally keep reference or just snapshot data.
  product_title text not null,  -- Snapshot title
  price_at_purchase numeric not null, -- Snapshot price
  quantity integer not null,
  size text,
  image_url text
);

alter table order_items enable row level security;

create policy "Users can view their own order items" on order_items
  for select using (
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );
