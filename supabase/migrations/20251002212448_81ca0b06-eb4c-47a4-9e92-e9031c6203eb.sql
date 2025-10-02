-- Fix notification trigger function to use valid enum values or compare as text
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
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
    -- Compare as text to avoid enum casting issues if labels change
    CASE NEW.status::text
      WHEN 'مؤكد - جاري التنفيذ' THEN
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