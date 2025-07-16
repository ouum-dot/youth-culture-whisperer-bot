
-- Create a table to store chat interactions with user association
CREATE TABLE public.chat_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  bot_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics summary table for better performance
CREATE TABLE public.analytics_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  categories JSONB DEFAULT '{}',
  sentiments JSONB DEFAULT '{}',
  peak_hour INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.chat_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_interactions
CREATE POLICY "Users can view their own chat interactions" 
  ON public.chat_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat interactions" 
  ON public.chat_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat interactions" 
  ON public.chat_interactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for analytics_summary
CREATE POLICY "Users can view their own analytics" 
  ON public.analytics_summary 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" 
  ON public.analytics_summary 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" 
  ON public.analytics_summary 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update analytics summary
CREATE OR REPLACE FUNCTION public.update_analytics_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  interaction_date DATE;
  category_counts JSONB;
  sentiment_counts JSONB;
  hour_of_day INTEGER;
BEGIN
  interaction_date := DATE(NEW.timestamp);
  hour_of_day := EXTRACT(HOUR FROM NEW.timestamp);
  
  -- Calculate category counts for the day
  SELECT jsonb_object_agg(category, count)
  INTO category_counts
  FROM (
    SELECT category, COUNT(*)::integer as count
    FROM public.chat_interactions
    WHERE user_id = NEW.user_id AND DATE(timestamp) = interaction_date
    GROUP BY category
  ) counts;
  
  -- Calculate sentiment counts for the day
  SELECT jsonb_object_agg(sentiment, count)
  INTO sentiment_counts
  FROM (
    SELECT sentiment, COUNT(*)::integer as count
    FROM public.chat_interactions
    WHERE user_id = NEW.user_id AND DATE(timestamp) = interaction_date
    GROUP BY sentiment
  ) counts;
  
  -- Insert or update analytics summary
  INSERT INTO public.analytics_summary (user_id, date, total_interactions, categories, sentiments, peak_hour)
  VALUES (NEW.user_id, interaction_date, 1, category_counts, sentiment_counts, hour_of_day)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_interactions = (
      SELECT COUNT(*)
      FROM public.chat_interactions
      WHERE user_id = NEW.user_id AND DATE(timestamp) = interaction_date
    ),
    categories = category_counts,
    sentiments = sentiment_counts,
    peak_hour = (
      SELECT EXTRACT(HOUR FROM timestamp)::integer
      FROM public.chat_interactions
      WHERE user_id = NEW.user_id AND DATE(timestamp) = interaction_date
      GROUP BY EXTRACT(HOUR FROM timestamp)
      ORDER BY COUNT(*) DESC
      LIMIT 1
    );
  
  RETURN NEW;
END;
$$;

-- Create trigger to update analytics on new interactions
CREATE TRIGGER update_analytics_on_interaction
  AFTER INSERT ON public.chat_interactions
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_summary();
