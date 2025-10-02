-- Fix security issues: Add search_path to functions

-- Drop and recreate generate_order_number with proper security
DROP FUNCTION IF EXISTS generate_order_number();
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  order_num TEXT;
BEGIN
  next_num := nextval('order_number_seq');
  order_num := 'ORD-' || LPAD(next_num::TEXT, 6, '0');
  RETURN order_num;
END;
$$;

-- Drop and recreate set_order_number with proper security
DROP FUNCTION IF EXISTS set_order_number() CASCADE;
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER before_insert_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();