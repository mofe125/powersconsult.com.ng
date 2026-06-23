
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
