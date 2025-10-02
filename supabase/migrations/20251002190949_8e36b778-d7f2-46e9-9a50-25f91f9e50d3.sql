-- Create enum for content types
CREATE TYPE public.content_type AS ENUM ('research', 'seminar', 'report');

-- Create enum for access types
CREATE TYPE public.access_type AS ENUM ('view_only', 'free_download', 'paid_download');

-- Create table for content/files
CREATE TABLE public.content_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  content_type public.content_type NOT NULL,
  access_type public.access_type NOT NULL DEFAULT 'view_only',
  price DECIMAL(10, 2) DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content_files ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can view content files (for public pages)
CREATE POLICY "Anyone can view content files"
ON public.content_files
FOR SELECT
USING (true);

-- Only admins can insert content files
CREATE POLICY "Admins can insert content files"
ON public.content_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can update content files
CREATE POLICY "Admins can update content files"
ON public.content_files
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete content files
CREATE POLICY "Admins can delete content files"
ON public.content_files
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name)
VALUES ('content-files', 'content-files');

-- Storage policies: Anyone can view files
CREATE POLICY "Anyone can view content files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'content-files');

-- Only admins can upload files
CREATE POLICY "Admins can upload content files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can update files
CREATE POLICY "Admins can update content files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete files
CREATE POLICY "Admins can delete content files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_content_files_updated_at
BEFORE UPDATE ON public.content_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();