-- Add region and county columns to orders table for better delivery management
ALTER TABLE orders 
ADD COLUMN delivery_region VARCHAR(100),
ADD COLUMN delivery_county VARCHAR(100);

-- Add index for faster region-based queries
CREATE INDEX idx_orders_region ON orders(delivery_region);
CREATE INDEX idx_orders_county ON orders(delivery_county);

-- Add comment for documentation
COMMENT ON COLUMN orders.delivery_region IS 'Kenyan region for delivery (e.g., Nairobi, Central, Coast)';
COMMENT ON COLUMN orders.delivery_county IS 'Specific county within the region for delivery';
