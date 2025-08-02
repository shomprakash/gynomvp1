-- Create tracker_data table for multi-purpose health tracking
CREATE TABLE public.tracker_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tracker_type TEXT NOT NULL CHECK (tracker_type IN ('period', 'pregnancy', 'menopause', 'ovulation')),
  data JSONB NOT NULL DEFAULT '{}',
  insights JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tracker_data ENABLE ROW LEVEL SECURITY;

-- Create policies for tracker_data
CREATE POLICY "Users can view their own tracker data" 
ON public.tracker_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracker data" 
ON public.tracker_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracker data" 
ON public.tracker_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracker data" 
ON public.tracker_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_tracker_data_updated_at
BEFORE UPDATE ON public.tracker_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();