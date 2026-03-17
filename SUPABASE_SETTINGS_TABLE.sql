-- ============================================
-- Restaurant Settings Table Setup for Supabase
-- ============================================

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Restaurant Settings (JSONB)
  restaurant JSONB DEFAULT '{
    "name": "مطعم بزوم",
    "phone": "0123456789",
    "address": "دمياط , ميدان الساعة",
    "email": "bazzomrestaurant@gmail.com",
    "openingTime": "12:00",
    "closingTime": "23:00",
    "deliveryFee": "0",
    "minOrderValue": "0",
    "description": "مطعم بزوم - الوجبات الشهية والطازجة",
    "logo": ""
  }',
  
  -- App Settings (JSONB)
  app JSONB DEFAULT '{
    "maintenanceMode": false,
    "enableOnlinePayment": true,
    "enableCashPayment": true,
    "enableDelivery": true,
    "enableDineIn": true,
    "maxOrdersPerDay": "100",
    "avgDeliveryTime": "30"
  }',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE public.settings IS 'تخزين إعدادات المطعم والتطبيق';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_settings_id ON public.settings(id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_settings_timestamp ON public.settings;
CREATE TRIGGER update_settings_timestamp
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_timestamp();

-- Insert default settings (if table is empty)
INSERT INTO public.settings (id, restaurant, app)
SELECT 
  gen_random_uuid(),
  '{
    "name": "مطعم بزوم",
    "phone": "0123456789",
    "address": "دمياط , ميدان الساعة",
    "email": "bazzomrestaurant@gmail.com",
    "openingTime": "12:00",
    "closingTime": "23:00",
    "deliveryFee": "0",
    "minOrderValue": "0",
    "description": "مطعم بزوم - تقدم أشهى الوجبات",
    "logo": ""
  }',
  '{
    "maintenanceMode": false,
    "enableOnlinePayment": true,
    "enableCashPayment": true,
    "enableDelivery": true,
    "enableDineIn": true,
    "maxOrdersPerDay": "100",
    "avgDeliveryTime": "30"
  }'
WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read settings
CREATE POLICY "Enable read access for all users" ON public.settings
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can update settings
CREATE POLICY "Enable update for authenticated users only" ON public.settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert settings
CREATE POLICY "Enable insert for authenticated users only" ON public.settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Verify Setup
-- ============================================

-- Check if data was inserted
SELECT COUNT(*) as settings_count FROM public.settings;

-- View the data
SELECT 
  id,
  restaurant->'name' as restaurant_name,
  restaurant->'phone' as phone,
  restaurant->'email' as email,
  restaurant->'address' as address,
  app->'maintenanceMode' as maintenance_mode,
  created_at,
  updated_at
FROM public.settings
LIMIT 1;
