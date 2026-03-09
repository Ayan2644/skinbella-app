-- Create storage bucket for user profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'selfies',
  'selfies',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Users can upload to their own folder
CREATE POLICY "Users can upload own selfie"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'selfies' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can replace their own photos (upsert)
CREATE POLICY "Users can update own selfie"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'selfies' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read (bucket is public, URLs are permanent)
CREATE POLICY "Public read selfies"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'selfies');
