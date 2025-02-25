-- Create an instance schedules table
CREATE TABLE IF NOT EXISTS instance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('start', 'stop')),
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'once')),
  day_of_week INTEGER NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  day_of_month INTEGER NULL CHECK (day_of_month >= 1 AND day_of_month <= 31),
  time TIME NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  next_run TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC'
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_instance_schedules_instance_id ON instance_schedules(instance_id);
CREATE INDEX IF NOT EXISTS idx_instance_schedules_next_run ON instance_schedules(next_run); 