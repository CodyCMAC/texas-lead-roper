-- Create a private storage bucket for attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments', 
  'attachments', 
  false,  -- Private bucket (requires auth)
  52428800,  -- 50MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Allow authenticated users to view attachments in their workspaces
CREATE POLICY "Users can view workspace attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid() IN (
    SELECT ur.user_id FROM public.user_roles ur
    WHERE ur.workspace_id = (storage.foldername(name))[1]::uuid
  )
);

-- Allow authenticated users to upload to their workspace folder
CREATE POLICY "Users can upload to workspace folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid() IN (
    SELECT ur.user_id FROM public.user_roles ur
    WHERE ur.workspace_id = (storage.foldername(name))[1]::uuid
  )
);

-- Allow users to update their own uploaded files
CREATE POLICY "Users can update own attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[2]
);