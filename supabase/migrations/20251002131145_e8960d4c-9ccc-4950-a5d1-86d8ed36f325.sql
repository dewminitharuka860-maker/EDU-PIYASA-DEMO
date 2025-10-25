-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT NOT NULL,
  description TEXT,
  description_si TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  time_limit INTEGER DEFAULT 30,
  points_per_question INTEGER DEFAULT 10,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  question_si TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_a_si TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_b_si TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_c_si TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_d_si TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table to track student progress
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  time_taken INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Everyone can view quizzes"
ON public.quizzes
FOR SELECT
USING (true);

CREATE POLICY "Admins and teachers can manage quizzes"
ON public.quizzes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS Policies for quiz_questions
CREATE POLICY "Everyone can view quiz questions"
ON public.quiz_questions
FOR SELECT
USING (true);

CREATE POLICY "Admins and teachers can manage quiz questions"
ON public.quiz_questions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
ON public.quiz_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and teachers can view all attempts"
ON public.quiz_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();