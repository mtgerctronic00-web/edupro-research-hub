-- حذف bucket القديم تماماً
DELETE FROM storage.objects WHERE bucket_id = 'pdf-translations';
DELETE FROM storage.buckets WHERE id = 'pdf-translations';