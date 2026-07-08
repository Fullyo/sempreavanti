
-- update trigger helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- ============ reservations ============
CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guesty_id text NOT NULL UNIQUE,
  guest text,
  checkin date,
  checkout date,
  nights integer,
  listing_id text,
  listing_name text,
  status text,
  meal_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
-- no policies: only the service role (edge functions) may access

CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ menu_dishes ============
CREATE TABLE public.menu_dishes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course text NOT NULL,           -- breakfast | appetizer | main | dessert
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_dishes TO anon, authenticated;
GRANT ALL ON public.menu_dishes TO service_role;
ALTER TABLE public.menu_dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active dishes are publicly viewable"
  ON public.menu_dishes FOR SELECT
  USING (is_active = true);

CREATE TRIGGER trg_menu_dishes_updated BEFORE UPDATE ON public.menu_dishes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ meal_plans ============
CREATE TABLE public.meal_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_token uuid NOT NULL UNIQUE,
  reservation_id uuid REFERENCES public.reservations(id) ON DELETE CASCADE,
  guest text,
  checkin date,
  checkout date,
  breakfast_time text,
  lunch_time text,
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.meal_plans TO service_role;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_meal_plans_updated BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ meal_selections ============
CREATE TABLE public.meal_selections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id uuid NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  day date NOT NULL,
  course text NOT NULL,   -- breakfast | lunch_appetizer | lunch | dinner_appetizer | dinner | dessert
  dish_id uuid REFERENCES public.menu_dishes(id) ON DELETE SET NULL,
  free_text text,
  skip boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meal_plan_id, day, course)
);
GRANT ALL ON public.meal_selections TO service_role;
ALTER TABLE public.meal_selections ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_meal_selections_updated BEFORE UPDATE ON public.meal_selections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
