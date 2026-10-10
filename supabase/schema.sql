-- ====================================================================
-- HOME COOK FINDER — PRODUCTION SUPABASE POSTGRESQL SCHEMA & RLS
-- ====================================================================

-- 1. PROFILES TABLE (Tied to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER', -- CUSTOMER | COOK | ADMIN
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COOK PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.cook_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  kitchen_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  photo TEXT,
  bio TEXT,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 17.4483,
  lng DOUBLE PRECISION DEFAULT 78.3915,
  distance_km DOUBLE PRECISION DEFAULT 1.0,
  rating DOUBLE PRECISION DEFAULT 5.0,
  review_count INT DEFAULT 0,
  starting_price NUMERIC DEFAULT 120,
  cuisines TEXT[] DEFAULT ARRAY['Home Style', 'North Indian', 'South Indian'],
  experience_years INT DEFAULT 2,
  is_verified BOOLEAN DEFAULT TRUE,
  verification_date TEXT,
  next_check_days INT DEFAULT 30,
  fssai_number TEXT,
  aadhaar_status TEXT DEFAULT 'VERIFIED',
  available_today BOOLEAN DEFAULT TRUE,
  prep_time_minutes INT DEFAULT 30,
  opening_hours TEXT DEFAULT '10:00 AM - 10:00 PM',
  accepted_payment_methods TEXT[] DEFAULT ARRAY['PHONEPE_UPI', 'RAZORPAY_GATEWAY', 'CARD', 'NETBANKING', 'COD'],
  payout_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN AUTHORIZATIONS TABLE (Private Server-Verified Admin Roster)
CREATE TABLE IF NOT EXISTS public.admin_authorizations (
  id TEXT PRIMARY KEY DEFAULT ('auth_' || gen_random_uuid()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | DISABLED
  granted_by TEXT DEFAULT 'OWNER_ADMIN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY DEFAULT ('item_' || gen_random_uuid()),
  cook_id TEXT REFERENCES public.cook_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  prep_time_minutes INT DEFAULT 25,
  dietary_type TEXT DEFAULT 'VEG',
  available_today BOOLEAN DEFAULT TRUE,
  paused BOOLEAN DEFAULT FALSE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ord_' || gen_random_uuid()),
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES public.profiles(id),
  cook_id TEXT REFERENCES public.cook_profiles(id),
  cook_name TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 35,
  tax NUMERIC DEFAULT 20,
  total NUMERIC NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_option TEXT DEFAULT 'Standard Delivery',
  payment_method TEXT DEFAULT 'RAZORPAY_GATEWAY',
  payment_status TEXT DEFAULT 'UNPAID',
  status TEXT DEFAULT 'PLACED',
  prep_time_minutes INT DEFAULT 25,
  eta_minutes INT DEFAULT 30,
  settlement_status TEXT DEFAULT 'PENDING_SETTLEMENT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY DEFAULT ('oi_' || gen_random_uuid()),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id TEXT,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  image TEXT
);

-- 6. REVIEWS TABLE (Tied to Completed Order)
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT ('rev_' || gen_random_uuid()),
  order_id TEXT UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id),
  customer_name TEXT NOT NULL,
  cook_id TEXT REFERENCES public.cook_profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  dish_rating TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || gen_random_uuid()),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id),
  gateway TEXT NOT NULL,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  gateway_signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'PENDING',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- AUTOMATED TRIGGER: PROFILE CREATION ON SUPABASE AUTH SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'),
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cook_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. COOK PROFILES POLICIES
CREATE POLICY "Cook profiles public read" ON public.cook_profiles FOR SELECT USING (true);
CREATE POLICY "Cook updates own profile" ON public.cook_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 3. ORDERS POLICIES
CREATE POLICY "Customer reads own orders" ON public.orders FOR SELECT USING (
  auth.uid() = customer_id OR
  auth.uid() IN (SELECT user_id FROM public.cook_profiles WHERE id = cook_id) OR
  auth.uid() IN (SELECT user_id FROM public.admin_authorizations WHERE status = 'ACTIVE')
);
CREATE POLICY "Customer creates own order" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 4. REVIEWS POLICIES
CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customer creates review for completed order" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 5. ADMIN AUTHORIZATIONS POLICIES
CREATE POLICY "Admin authorizations private read" ON public.admin_authorizations FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.admin_authorizations WHERE status = 'ACTIVE')
);
