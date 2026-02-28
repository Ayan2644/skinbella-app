
-- Granular quiz funnel events for precise tracking
CREATE TABLE public.quiz_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  event_type text NOT NULL, -- 'quiz_started', 'question_answered', 'quiz_completed', 'result_viewed', 'cta_clicked'
  preset_id text NOT NULL DEFAULT 'main',
  question_index integer,
  question_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Indexes for fast aggregation
CREATE INDEX idx_quiz_events_type ON public.quiz_events(event_type);
CREATE INDEX idx_quiz_events_preset ON public.quiz_events(preset_id);
CREATE INDEX idx_quiz_events_session ON public.quiz_events(session_id);
CREATE INDEX idx_quiz_events_created ON public.quiz_events(created_at);

-- Enable RLS
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous quiz takers)
CREATE POLICY "Anyone can insert quiz events"
  ON public.quiz_events FOR INSERT
  WITH CHECK (true);

-- Only admins can read events
CREATE POLICY "Admins can read quiz events"
  ON public.quiz_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add preset_id to leads table for tracking which preset converted
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS preset_id text DEFAULT 'main';
