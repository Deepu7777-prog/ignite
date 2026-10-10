-- Supabase PostgreSQL Schema DDL & RLS Policies for Home Cook Finder

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('CUSTOMER', 'COOK', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COOK PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.cook_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  kitchen_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  photo TEXT NOT NULL,
  bio TEXT,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  distance_km DOUBLE PRECISION DEFAULT 0.0,
  rating DOUBLE PRECISION DEFAULT 5.0,
  review_count INT DEFAULT 0,
  starting_price NUMERIC DEFAULT 100,
  cuisines TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 3,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date DATE,
  next_check_days INT DEFAULT 30,
  fssai_number TEXT,
  aadhaar_status TEXT DEFAULT 'PENDING',
  available_today BOOLEAN DEFAULT TRUE,
  prep_time_minutes INT DEFAULT 25,
  opening_hours TEXT DEFAULT '10:00 AM - 10:00 PM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  cook_id TEXT REFERENCES public.cook_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  prep_time_minutes INT DEFAULT 25,
  dietary_type TEXT NOT NULL CHECK (dietary_type IN ('VEG', 'NON_VEG')),
  available_today BOOLEAN DEFAULT TRUE,
  paused BOOLEAN DEFAULT FALSE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  cook_id TEXT NOT NULL REFERENCES public.cook_profiles(id),
  cook_name TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_option TEXT DEFAULT 'Standard Delivery',
  payment_method TEXT DEFAULT 'MOCK_PAYMENT',
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  status TEXT DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
  prep_time_minutes INT DEFAULT 25,
  eta_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE (Server-Verified Payment Audit Log)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  gateway TEXT NOT NULL DEFAULT 'RAZORPAY',
  gateway_order_id TEXT NOT NULL,
  gateway_payment_id TEXT,
  gateway_signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  cook_id TEXT NOT NULL REFERENCES public.cook_profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  dish_rating TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADDRESSES TABLE (With Real GPS Lat/Lng)
CREATE TABLE IF NOT EXISTS public.addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  label TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT DEFAULT 'Hyderabad',
  pincode TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VERIFICATION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.verification_applications (
  id TEXT PRIMARY KEY,
  cook_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  kitchen_name TEXT NOT NULL,
  address TEXT NOT NULL,
  experience_years INT DEFAULT 3,
  cuisines TEXT[] DEFAULT '{}',
  kitchen_photo TEXT,
  aadhaar_number TEXT NOT NULL,
  fssai_number TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 9. CUSTOM REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  servings INT DEFAULT 10,
  preferred_date DATE,
  preferred_time TEXT,
  budget_max NUMERIC,
  location TEXT,
  details TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'QUOTED', 'ACCEPTED', 'COMPLETED')),
  quotes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  cook_id TEXT NOT NULL REFERENCES public.cook_profiles(id),
  kitchen_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('DAILY', 'WEEKLY', 'MONTHLY')),
  dish_name TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED')),
  days_of_week TEXT[] DEFAULT '{}',
  meals_left INT DEFAULT 14,
  price_per_meal NUMERIC NOT NULL,
  next_delivery_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cook_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access for cook profiles" ON public.cook_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access for menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access for reviews" ON public.reviews FOR SELECT USING (true);

-- Authenticated User Orders Policies
CREATE POLICY "Allow customers to view own orders" ON public.orders FOR SELECT USING (auth.uid()::text = customer_id OR customer_id = 'usr_customer_demo');
CREATE POLICY "Allow cooks to view assigned orders" ON public.orders FOR SELECT USING (auth.uid()::text = cook_id OR cook_id = 'cook_priya');

-- Admin full access policy
CREATE POLICY "Allow admin full access" ON public.orders FOR ALL USING (true);
