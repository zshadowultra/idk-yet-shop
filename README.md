# DesiThreads - Mobile-First E-Commerce Store

A responsive, beautiful Indian fashion e-commerce store built with Next.js, Tailwind CSS, and Supabase.

## Features
- 📱 **Mobile First Design:** Sticky bottom nav, touch-friendly interfaces.
- 🎨 **Indian Aesthetic:** Vibrant colors and clean typography.
- 🛍️ **Storefront:** Browse categories, view products, simulated cart.
- 🔧 **Admin Panel:** Add products, manage inventory (located at `/admin`).
- ⚡ **Supabase Backend:** Real-time database for products and categories.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `schema.sql` (in this project root) and run it. This will create the necessary tables and security policies.
4. Go to **Project Settings > API**.
5. Copy the `Project URL` and `anon` public key.

### 2. Environment Variables
1. Rename `.env.local.example` to `.env.local`.
   ```bash
   mv .env.local.example .env.local
   ```
2. Paste your Supabase URL and Key into `.env.local`.

### 3. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile or desktop.

## Admin Access
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to add products. 
(Note: The current RLS policies in `schema.sql` are set to allow authenticated users to edit. You may need to sign up a user in Supabase Authentication first, or disable RLS for testing if you want public write access).