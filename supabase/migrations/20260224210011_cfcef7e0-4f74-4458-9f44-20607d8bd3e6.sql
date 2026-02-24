
-- Table to persist quiz questions (mirrors page_blocks pattern)
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id TEXT NOT NULL DEFAULT 'main',
  sort_order INTEGER NOT NULL DEFAULT 0,
  question_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  styles JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Public read (quiz is public-facing)
CREATE POLICY "Anyone can read quiz questions"
  ON public.quiz_questions FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quiz questions"
  ON public.quiz_questions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quiz questions"
  ON public.quiz_questions FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update timestamp
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
