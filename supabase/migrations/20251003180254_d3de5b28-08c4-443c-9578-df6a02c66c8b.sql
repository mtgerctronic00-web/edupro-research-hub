-- Create table for free service requests
CREATE TABLE public.free_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT DEFAULT 'قيد المراجعة',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.free_service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own requests"
ON public.free_service_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
ON public.free_service_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
ON public.free_service_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_free_service_requests_updated_at
BEFORE UPDATE ON public.free_service_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();