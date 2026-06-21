
CREATE POLICY "Anyone can upload application documents"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'applications');
