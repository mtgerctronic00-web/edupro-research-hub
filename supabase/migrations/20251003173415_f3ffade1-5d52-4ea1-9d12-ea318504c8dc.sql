-- Add new columns to modifications table
ALTER TABLE public.modifications
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS contact_method TEXT;

-- Update modification_type to include new options
COMMENT ON COLUMN public.modifications.modification_type IS 'Types: addition, deletion, rephrasing, correction, formatting';