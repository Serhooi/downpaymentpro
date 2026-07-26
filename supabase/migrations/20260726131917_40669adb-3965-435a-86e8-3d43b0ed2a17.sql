CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT NOT NULL DEFAULT 'guide',
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();