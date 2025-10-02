-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  related_order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Function to create notification when order status changes
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only create notification if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Set notification content based on status
    CASE NEW.status
      WHEN 'قيد التنفيذ' THEN
        notification_title := 'تم قبول طلبك';
        notification_message := 'تم قبول طلبك "' || NEW.title || '" وجاري العمل عليه';
        notification_type := 'success';
      WHEN 'مكتمل' THEN
        notification_title := 'تم إكمال طلبك';
        notification_message := 'تم إكمال طلبك "' || NEW.title || '" بنجاح';
        notification_type := 'success';
      WHEN 'مرفوض' THEN
        notification_title := 'تم رفض طلبك';
        notification_message := 'تم رفض طلبك "' || NEW.title || '". السبب: ' || COALESCE(NEW.rejection_reason, 'غير محدد');
        notification_type := 'error';
      ELSE
        notification_title := 'تحديث على طلبك';
        notification_message := 'تم تحديث حالة طلبك "' || NEW.title || '"';
        notification_type := 'info';
    END CASE;

    -- Insert notification
    INSERT INTO public.notifications (user_id, title, message, type, related_order_id)
    VALUES (NEW.user_id, notification_title, notification_message, notification_type, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER order_status_change_notification
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_order_status_change();