-- Add phone column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.orders.phone IS 'Phone number of the person making the order';