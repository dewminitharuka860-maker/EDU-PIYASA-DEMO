
-- Create textbooks table
CREATE TABLE public.textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_si TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 13),
  medium TEXT NOT NULL CHECK (medium IN ('Sinhala', 'English', 'Tamil')),
  pdf_url TEXT NOT NULL,
  cover_image_url TEXT,
  file_size TEXT,
  description TEXT,
  description_si TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;

-- Everyone can view textbooks
CREATE POLICY "Everyone can view textbooks"
ON public.textbooks
FOR SELECT
USING (true);

-- Admins and teachers can manage textbooks
CREATE POLICY "Admins and teachers can manage textbooks"
ON public.textbooks
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_textbooks_updated_at
BEFORE UPDATE ON public.textbooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
