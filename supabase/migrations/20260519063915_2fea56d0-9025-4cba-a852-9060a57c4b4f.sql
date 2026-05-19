
UPDATE public.services SET type='tour' WHERE name IN ('Ally Cat — 3h','Ally Cat — 4h','Ally Cat — 6h');

UPDATE public.services
  SET price=2000, sub_text='Up to 5 guests · Kids under 13 free (with parent)'
  WHERE id=30;

UPDATE public.services
  SET sub_text='Up to 5 guests · Kids under 13 free (with parent)'
  WHERE id=32;

INSERT INTO public.services (category, name, price, type, unit_cost, sub_text, is_active, sort_order)
VALUES
  ('Wellness','Yoga — extra person',500,'margin',300,'Each additional adult beyond 5',true,4),
  ('Wellness','Sound Bath — extra person',600,'margin',400,'Each additional adult beyond 5',true,5);
