-- change_requests table
create table if not exists public.change_requests (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  page_name text not null default '',
  message text not null default '',
  status text not null default 'apen' check (status in ('apen','under_arbeid','ferdig')),
  attachments jsonb not null default '[]'::jsonb,
  created_by text not null default '',
  resolved_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_change_requests_path on public.change_requests(page_path);
create index if not exists idx_change_requests_status on public.change_requests(status);

alter table public.change_requests enable row level security;

create policy "change_requests read all" on public.change_requests for select using (true);
create policy "change_requests insert all" on public.change_requests for insert with check (true);
create policy "change_requests update all" on public.change_requests for update using (true) with check (true);
create policy "change_requests delete all" on public.change_requests for delete using (true);

drop trigger if exists trg_change_requests_updated_at on public.change_requests;
create trigger trg_change_requests_updated_at
  before update on public.change_requests
  for each row execute procedure public.touch_page_approvals_updated_at();

-- Storage bucket for attachments (public read)
insert into storage.buckets (id, name, public)
values ('approval-attachments', 'approval-attachments', true)
on conflict (id) do nothing;

create policy "approval-attachments public read"
  on storage.objects for select
  using (bucket_id = 'approval-attachments');

create policy "approval-attachments open insert"
  on storage.objects for insert
  with check (bucket_id = 'approval-attachments');

create policy "approval-attachments open delete"
  on storage.objects for delete
  using (bucket_id = 'approval-attachments');