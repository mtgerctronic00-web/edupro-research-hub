-- Create storage buckets only (policies may already exist)
INSERT INTO storage.buckets (id, name) 
VALUES 
  ('payment-receipts', 'payment-receipts'),
  ('content-files', 'content-files')
ON CONFLICT (id) DO NOTHING;