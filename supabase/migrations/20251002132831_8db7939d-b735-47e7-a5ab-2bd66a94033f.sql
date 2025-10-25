
-- Create activities table for drag & drop matching exercises
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT NOT NULL,
  description TEXT,
  description_si TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 13),
  activity_type TEXT NOT NULL DEFAULT 'matching' CHECK (activity_type IN ('matching', 'sorting', 'categorizing')),
  items JSONB NOT NULL,
  points INTEGER DEFAULT 10,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity attempts table
CREATE TABLE public.activity_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER DEFAULT 0,
  total_items INTEGER NOT NULL,
  correct_matches INTEGER DEFAULT 0,
  time_taken INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_attempts ENABLE ROW LEVEL SECURITY;

-- Everyone can view activities
CREATE POLICY "Everyone can view activities"
ON public.activities
FOR SELECT
USING (true);

-- Admins and teachers can manage activities
CREATE POLICY "Admins and teachers can manage activities"
ON public.activities
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Users can insert own activity attempts
CREATE POLICY "Users can insert own activity attempts"
ON public.activity_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view own activity attempts
CREATE POLICY "Users can view own activity attempts"
ON public.activity_attempts
FOR SELECT
USING (auth.uid() = user_id);

-- Admins and teachers can view all attempts
CREATE POLICY "Admins and teachers can view all activity attempts"
ON public.activity_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
