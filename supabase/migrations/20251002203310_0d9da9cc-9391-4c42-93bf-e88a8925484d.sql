-- Create storage bucket for content files (minimal, compatible)
INSERT INTO storage.buckets (id, name)
VALUES ('content-files', 'content-files')
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled (no-op if already enabled)
DO $$ BEGIN
  PERFORM 1;
EXCEPTION WHEN others THEN NULL; END $$;

-- Policies: drop if exist then recreate
DROP POLICY IF EXISTS "Public can view content files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload content files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete content files" ON storage.objects;

CREATE POLICY "Public can view content files"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-files');

CREATE POLICY "Admins can upload content files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update content files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete content files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin')
);