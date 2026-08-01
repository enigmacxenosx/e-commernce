-- Add columns to track platform order placement and redirect URLs
ALTER TABLE orders 
ADD COLUMN platform_order_ids JSONB,
ADD COLUMN platform_redirect_urls JSONB,
ADD COLUMN auto_placed_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for better performance
CREATE INDEX idx_orders_auto_placed ON orders(auto_placed_at);
CREATE INDEX idx_orders_platform_ids ON orders USING GIN(platform_order_ids);

-- Add comments for documentation
COMMENT ON COLUMN orders.platform_order_ids IS 'JSON object storing order IDs from external platforms (e.g., {"jumia": "JUM-123", "kilimall": "KIL-456"})';
COMMENT ON COLUMN orders.platform_redirect_urls IS 'JSON object storing redirect URLs for completing orders on external platforms';
COMMENT ON COLUMN orders.auto_placed_at IS 'Timestamp when order was automatically placed on external platforms';
