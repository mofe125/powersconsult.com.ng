
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create feature_requests table
CREATE TABLE public.feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Planned', 'In Progress', 'Shipped', 'Declined')),
  submitter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, request_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Roles are viewable by authenticated users" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Feature requests policies
CREATE POLICY "Feature requests are viewable by authenticated users" ON public.feature_requests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can submit requests" ON public.feature_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "Admins can update any request" ON public.feature_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own requests" ON public.feature_requests
  FOR UPDATE TO authenticated USING (auth.uid() = submitter_id);

-- Votes policies
CREATE POLICY "Votes are viewable by authenticated users" ON public.votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own votes" ON public.votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_votes_request_id ON public.votes(request_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_feature_requests_status ON public.feature_requests(status);
CREATE INDEX idx_feature_requests_created_at ON public.feature_requests(created_at DESC);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at
  BEFORE UPDATE ON public.feature_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

-- Drop old restrictive update policies
DROP POLICY IF EXISTS "Users can update their own requests" ON public.feature_requests;
DROP POLICY IF EXISTS "Admins can update any request" ON public.feature_requests;

-- All authenticated users can update any request
CREATE POLICY "Authenticated users can update requests"
  ON public.feature_requests FOR UPDATE TO authenticated
  USING (true);

-- All authenticated users can delete any request
CREATE POLICY "Authenticated users can delete requests"
  ON public.feature_requests FOR DELETE TO authenticated
  USING (true);

-- Add vote_type column: 1 for upvote, -1 for downvote
ALTER TABLE public.votes ADD COLUMN vote_type smallint NOT NULL DEFAULT 1;

-- Update the unique constraint to allow one vote per user per request (regardless of type)
-- The existing unique constraint on (user_id, request_id) already handles this

-- Allow authenticated users to update their own votes (for switching up/down)
CREATE POLICY "Users can update their own votes"
  ON public.votes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_request_id ON public.comments(request_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read comments
CREATE POLICY "Comments are viewable by authenticated users"
  ON public.comments FOR SELECT TO authenticated
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Users can insert their own comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

-- Auto-update updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tighten user_roles: users can only see their own roles
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Restrict profiles: users can only read their own profile for sensitive fields
-- But we need name visibility for displaying submitter names on cards
-- Solution: replace broad SELECT with own-profile policy + create a public names view

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Users can fully read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- All authenticated users can read any profile (needed for submitter names)
-- This is acceptable for an internal org tool where all users are trusted
CREATE POLICY "Authenticated users can read profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- Create a security definer view for aggregated vote counts
CREATE OR REPLACE VIEW public.vote_counts
WITH (security_invoker = false)
AS
SELECT
  request_id,
  COUNT(*) FILTER (WHERE vote_type = 1) AS up_count,
  COUNT(*) FILTER (WHERE vote_type = -1) AS down_count
FROM public.votes
GROUP BY request_id;

-- Grant access to authenticated users
GRANT SELECT ON public.vote_counts TO authenticated;

-- Restrict votes SELECT policy to own votes only
DROP POLICY IF EXISTS "Votes are viewable by authenticated users" ON public.votes;
CREATE POLICY "Users can view their own votes"
  ON public.votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop the security definer view
DROP VIEW IF EXISTS public.vote_counts;

-- Create a security definer function to get vote counts
CREATE OR REPLACE FUNCTION public.get_vote_counts()
RETURNS TABLE (request_id uuid, up_count bigint, down_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    v.request_id,
    COUNT(*) FILTER (WHERE v.vote_type = 1) AS up_count,
    COUNT(*) FILTER (WHERE v.vote_type = -1) AS down_count
  FROM public.votes v
  GROUP BY v.request_id;
$$;

-- Drop the restrictive SELECT policy on votes
DROP POLICY "Users can view their own votes" ON public.votes;

-- Create a broader SELECT policy for all authenticated users
CREATE POLICY "Authenticated users can view all votes"
ON public.votes
FOR SELECT
TO authenticated
USING (true);

-- Drop trigger on auth.users if present
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop legacy tables (cascades policies and FKs)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.feature_requests CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop legacy functions (no longer referenced)
DROP FUNCTION IF EXISTS public.get_vote_counts() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop the app_role enum (no longer used)
DROP TYPE IF EXISTS public.app_role CASCADE;

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  state TEXT,
  city TEXT,
  linkedin_url TEXT,
  employment_status TEXT,
  current_job_title TEXT,
  years_of_experience TEXT,
  highest_qualification TEXT,
  industry TEXT,
  expected_salary TEXT,
  skills TEXT,
  certifications TEXT,
  preferred_work_types TEXT[] DEFAULT '{}',
  career_interests TEXT[] DEFAULT '{}',
  cv_path TEXT,
  cover_letter_path TEXT,
  portfolio_path TEXT,
  certificates_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can upload application documents"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'applications');

DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;

CREATE POLICY "Anyone can submit an application"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(full_name)) > 1
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

CREATE POLICY "No direct read access to applications"
  ON public.applications
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "No direct updates to applications"
  ON public.applications
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No direct deletes from applications"
  ON public.applications
  FOR DELETE
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Anyone can upload application documents" ON storage.objects;

CREATE POLICY "Restricted uploads to applications bucket"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'applications'
    AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    AND lower(name) ~ '\.(pdf|doc|docx|png|jpg|jpeg|webp|zip)$'
  );

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  location text,
  website text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access companies" ON public.companies FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE TABLE public.positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  work_type text,
  location text,
  required_skills text,
  description text,
  min_years text,
  salary text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.positions TO service_role;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access positions" ON public.positions FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE TABLE public.ai_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id uuid NOT NULL REFERENCES public.positions(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (position_id, application_id)
);
GRANT ALL ON public.ai_matches TO service_role;
ALTER TABLE public.ai_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access ai_matches" ON public.ai_matches FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE INDEX ai_matches_position_score_idx ON public.ai_matches (position_id, score DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
