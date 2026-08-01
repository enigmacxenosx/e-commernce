-- Create products table to cache product data from external APIs
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'jumia', 'kilimall', 'jiji'
  name VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  image_url TEXT,
  -- Add support for multiple images and enhanced product data
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  in_stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  brand VARCHAR(100),
  availability BOOLEAN DEFAULT true,
  external_url TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_external_platform ON products(external_id, platform);
-- Add GIN index for JSONB specifications search
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING gin(specifications);
