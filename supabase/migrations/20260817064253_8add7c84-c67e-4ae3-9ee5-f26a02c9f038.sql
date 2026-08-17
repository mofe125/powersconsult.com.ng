CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  company_size TEXT,
  industry TEXT,
  hr_needs TEXT[] NOT NULL DEFAULT '{}',
  current_hr_setup TEXT,
  message TEXT,
  preferred_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consultation_requests TO anon, authenticated;
GRANT ALL ON public.consultation_requests TO service_role;

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation request"
  ON public.consultation_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 120
    AND work_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(work_email) <= 200
    AND length(trim(company_name)) BETWEEN 1 AND 160
    AND coalesce(length(message), 0) <= 4000
  );

CREATE POLICY "No public reads of consultation requests"
  ON public.consultation_requests FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No public updates of consultation requests"
  ON public.consultation_requests FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "No public deletes of consultation requests"
  ON public.consultation_requests FOR DELETE TO anon, authenticated USING (false);

CREATE INDEX idx_consultation_requests_created_at ON public.consultation_requests (created_at DESC);