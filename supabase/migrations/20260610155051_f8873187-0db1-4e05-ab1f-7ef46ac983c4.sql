create table public.petty_cash (
  booking_ref text primary key,
  float_amount numeric not null default 0,
  currency text not null default 'USD',
  notes text,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.petty_cash to anon, authenticated;
grant all on public.petty_cash to service_role;
alter table public.petty_cash enable row level security;
create policy "Allow all on petty_cash" on public.petty_cash for all using (true) with check (true);