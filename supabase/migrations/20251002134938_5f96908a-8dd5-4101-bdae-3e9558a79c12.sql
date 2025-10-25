-- Add emotional state tracking and effort metrics
ALTER TABLE activity_attempts ADD COLUMN IF NOT EXISTS effort_score integer DEFAULT 0;
ALTER TABLE activity_attempts ADD COLUMN IF NOT EXISTS time_struggled integer DEFAULT 0;
ALTER TABLE activity_attempts ADD COLUMN IF NOT EXISTS hints_used integer DEFAULT 0;
ALTER TABLE activity_attempts ADD COLUMN IF NOT EXISTS creative_bonus integer DEFAULT 0;

ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS effort_score integer DEFAULT 0;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS time_struggled integer DEFAULT 0;
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS hints_used integer DEFAULT 0;

-- Add learning plan table for child autonomy
CREATE TABLE IF NOT EXISTS learning_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  weekly_goal integer DEFAULT 5,
  daily_goal integer DEFAULT 1,
  preferred_subjects jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own learning plans"
ON learning_plans FOR ALL
USING (auth.uid() = user_id);

-- Add "why" factor to lessons and activities
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS why_video_url text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS why_description text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS why_description_si text;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS why_video_url text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS why_description text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS why_description_si text;

-- Add parental alerts table
CREATE TABLE IF NOT EXISTS parental_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE parental_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view alerts for their children"
ON parental_alerts FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'parent'
  )
);

-- Add emotional state tracking
CREATE TABLE IF NOT EXISTS emotional_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state text NOT NULL,
  intensity integer DEFAULT 5,
  context text,
  activity_type text,
  activity_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE emotional_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own emotional states"
ON emotional_states FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and teachers can view emotional states"
ON emotional_states FOR SELECT
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

-- Add trigger for updated_at
CREATE TRIGGER update_learning_plans_updated_at
BEFORE UPDATE ON learning_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();