
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_dates TEXT,
  group_size TEXT,
  message TEXT,
  selected_activities TEXT[],
  guesty_reservation_id TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
