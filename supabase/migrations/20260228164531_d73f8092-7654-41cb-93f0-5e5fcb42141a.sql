
-- Table to manage quiz presets/variations
CREATE TABLE public.quiz_presets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_id text NOT NULL UNIQUE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quiz presets" ON public.quiz_presets FOR SELECT USING (true);
CREATE POLICY "Admins can insert quiz presets" ON public.quiz_presets FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update quiz presets" ON public.quiz_presets FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete quiz presets" ON public.quiz_presets FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_quiz_presets_updated_at
  BEFORE UPDATE ON public.quiz_presets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default preset for existing "main" quiz
INSERT INTO public.quiz_presets (preset_id, name, is_active) VALUES ('main', 'Principal', true);
