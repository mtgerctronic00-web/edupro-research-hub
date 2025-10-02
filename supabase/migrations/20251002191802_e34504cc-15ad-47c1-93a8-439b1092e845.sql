-- Add content_file_id to orders table to link orders with content files
ALTER TABLE public.orders
ADD COLUMN content_file_id UUID REFERENCES public.content_files(id) ON DELETE SET NULL,
ADD COLUMN order_number TEXT UNIQUE;

-- Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Create function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  order_num TEXT;
BEGIN
  next_num := nextval('order_number_seq');
  order_num := 'ORD-' || LPAD(next_num::TEXT, 6, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Update existing orders to have order numbers
UPDATE public.orders
SET order_number = generate_order_number()
WHERE order_number IS NULL;