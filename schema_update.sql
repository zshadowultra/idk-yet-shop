-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  address_line1 text,
  city text,
  state text,
  pincode text,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(full_name) >= 3)
);

-- 2. CARTS
create table public.carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CART ITEMS
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid references public.carts(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer default 1,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cart_id, product_id)
);

-- 4. ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  razorpay_order_id text unique,
  status text check (status in ('pending', 'paid', 'failed', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount numeric not null, -- Stored in INR (e.g., 999.00)
  shipping_address jsonb, -- Snapshot of address at time of order
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_title text not null, -- Snapshot in case product is deleted later
  product_price numeric not null, -- Snapshot of price at purchase
  quantity integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PAYMENTS (Audit Log)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  razorpay_payment_id text unique,
  razorpay_signature text,
  status text check (status in ('captured', 'failed', 'refunded')),
  amount numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)

-- Profiles: Users can view and edit their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Carts: Users can view/edit their own cart
alter table public.carts enable row level security;
create policy "Users can view own cart" on public.carts for select using (auth.uid() = user_id);
create policy "Users can create own cart" on public.carts for insert with check (auth.uid() = user_id);

-- Cart Items: Access via cart_id ownership
alter table public.cart_items enable row level security;
create policy "Users can view own cart items" on public.cart_items for select using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can insert own cart items" on public.cart_items for insert with check (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can update own cart items" on public.cart_items for update using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can delete own cart items" on public.cart_items for delete using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);

-- Orders: Users view own, Admins view all (mock admin check for now)
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);

-- Order Items: Inherit access from order
alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);
-- Note: Order items are usually inserted by server-side logic (Service Role), but if client inserts, add policy.

-- AUTOMATION: Create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Also create an empty cart for them
  insert into public.carts (user_id) values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
