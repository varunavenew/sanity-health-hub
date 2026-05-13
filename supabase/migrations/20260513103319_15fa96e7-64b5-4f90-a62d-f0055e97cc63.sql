create table if not exists public.page_approvals (
  path text primary key,
  name text not null,
  category text not null default 'Annet',
  status text not null default 'avventer' check (status in ('godkjent','avventer','endringer')),
  comment text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);

alter table public.page_approvals enable row level security;

create policy "page_approvals read all" on public.page_approvals for select using (true);
create policy "page_approvals insert all" on public.page_approvals for insert with check (true);
create policy "page_approvals update all" on public.page_approvals for update using (true) with check (true);
create policy "page_approvals delete all" on public.page_approvals for delete using (true);

create or replace function public.touch_page_approvals_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_page_approvals_updated_at on public.page_approvals;
create trigger trg_page_approvals_updated_at
  before update on public.page_approvals
  for each row execute procedure public.touch_page_approvals_updated_at();