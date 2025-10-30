-- حذف الـ bucket القديم وإعادة إنشائه بالطريقة الصحيحة
DELETE FROM storage.objects WHERE bucket_id = 'pdf-translations';
DELETE FROM storage.buckets WHERE id = 'pdf-translations';

-- إنشاء bucket جديد
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at)
VALUES (
  'pdf-translations',
  'pdf-translations',
  NULL,
  now(),
  now()
);