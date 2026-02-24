
-- Create page_blocks table
CREATE TABLE public.page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL DEFAULT 'quiz_result',
  block_type text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  styles jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast page lookups
CREATE INDEX idx_page_blocks_page_id ON public.page_blocks (page_id, sort_order);

-- Enable RLS
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Everyone can read (needed for rendering the quiz result page)
CREATE POLICY "Anyone can read page blocks"
  ON public.page_blocks FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert page blocks"
  ON public.page_blocks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update page blocks"
  ON public.page_blocks FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete page blocks"
  ON public.page_blocks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_page_blocks_updated_at
  BEFORE UPDATE ON public.page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for page assets
INSERT INTO storage.buckets (id, name, public) VALUES ('page-assets', 'page-assets', true);

-- Storage policies
CREATE POLICY "Anyone can view page assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'page-assets');

CREATE POLICY "Admins can upload page assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'page-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'page-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete page assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'page-assets' AND public.has_role(auth.uid(), 'admin'));
