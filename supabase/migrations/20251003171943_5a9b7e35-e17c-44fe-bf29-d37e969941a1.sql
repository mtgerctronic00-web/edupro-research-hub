-- Create table for free sample requests
CREATE TABLE public.free_samples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  university TEXT NOT NULL,
  service_type TEXT NOT NULL,
  topic TEXT NOT NULL,
  pages_count INTEGER NOT NULL CHECK (pages_count >= 1 AND pages_count <= 4),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for modification requests
CREATE TABLE public.modifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  modification_type TEXT NOT NULL CHECK (modification_type IN ('addition', 'deletion', 'rephrasing', 'formatting')),
  details TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.free_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifications ENABLE ROW LEVEL SECURITY;

-- Create policies for free_samples
CREATE POLICY "Users can view their own free samples" 
ON public.free_samples 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own free samples" 
ON public.free_samples 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all free samples" 
ON public.free_samples 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update free samples" 
ON public.free_samples 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policies for modifications
CREATE POLICY "Users can view their own modifications" 
ON public.modifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own modifications" 
ON public.modifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all modifications" 
ON public.modifications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update modifications" 
ON public.modifications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates on free_samples
CREATE TRIGGER update_free_samples_updated_at
BEFORE UPDATE ON public.free_samples
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on modifications
CREATE TRIGGER update_modifications_updated_at
BEFORE UPDATE ON public.modifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();