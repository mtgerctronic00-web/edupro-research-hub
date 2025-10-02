-- Add is_general column to notifications table
ALTER TABLE public.notifications
ADD COLUMN is_general BOOLEAN DEFAULT false;

-- Make user_id nullable for general notifications
ALTER TABLE public.notifications
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

-- New policies that include general notifications
CREATE POLICY "Users can view their notifications and general notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_general = true);

CREATE POLICY "Users can insert their own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admins can insert general notifications
CREATE POLICY "Admins can insert general notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (is_general = true AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete any notification
CREATE POLICY "Admins can delete any notification"
ON public.notifications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));