-- Create storage bucket for PDF translations (simplified)
INSERT INTO storage.buckets (id, name)
VALUES ('pdf-translations', 'pdf-translations')
ON CONFLICT (id) DO UPDATE SET name = 'pdf-translations';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to pdf-translations" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from pdf-translations" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from pdf-translations" ON storage.objects;

-- Create storage policies for PDF translations bucket
CREATE POLICY "Allow public uploads to pdf-translations"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'pdf-translations');

CREATE POLICY "Allow public reads from pdf-translations"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pdf-translations');

CREATE POLICY "Allow public deletes from pdf-translations"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'pdf-translations');