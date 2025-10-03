-- Make delivery_date nullable in modifications table
ALTER TABLE modifications 
ALTER COLUMN delivery_date DROP NOT NULL;