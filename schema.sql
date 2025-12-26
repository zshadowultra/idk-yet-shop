-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Categories Table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric not null,
  original_price numeric, -- For showing discounts (e.g. ₹999 cut to ₹499)
  category_id uuid references categories(id),
  image_url text not null,
  sizes text[], -- Array of strings e.g. ['S', 'M', 'L']
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage Buckets setup (You need to create a bucket named 'ecommerce' in Supabase Storage manually and set public access)
-- This SQL just assumes the bucket exists for policy reference if needed, but bucket creation is usually done in UI.

-- Row Level Security (RLS) - Basic setup
alter table categories enable row level security;
alter table products enable row level security;

-- Policy: Everyone can read categories and products
create policy "Public categories are viewable by everyone" on categories for select using (true);
create policy "Public products are viewable by everyone" on products for select using (true);

-- Policy: Only authenticated users (admins) can insert/update/delete
-- For simplicity in this demo, we assume any logged in user is an admin. 
-- In production, you'd check a specific role.
create policy "Auth users can insert categories" on categories for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update categories" on categories for update using (auth.role() = 'authenticated');
create policy "Auth users can insert products" on products for insert with check (auth.role() = 'authenticated');
create policy "Auth users can update products" on products for update using (auth.role() = 'authenticated');
