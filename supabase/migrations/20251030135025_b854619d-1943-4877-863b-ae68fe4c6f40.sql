-- Create pdf-translations bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('pdf-translations', 'pdf-translations')
ON CONFLICT (id) DO NOTHING;