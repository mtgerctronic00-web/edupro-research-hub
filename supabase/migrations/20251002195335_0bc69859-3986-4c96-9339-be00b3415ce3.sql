-- Add notes column to orders table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN notes TEXT;
  END IF;
END $$;