create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  plan_slug text not null check (plan_slug in ('economico', 'bimestral', 'trimestral', 'semestral', 'anual')),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254 and email = lower(email)),
  phone text not null check (phone ~ '^55[1-9][0-9]{9,10}$'),
  payment_method text not null check (payment_method in ('pix', 'card')),
  status text not null default 'submitted' check (status in ('submitted', 'contacted', 'cancelled')),
  consent_version text not null check (consent_version = '2026-11-08'),
  consented_at timestamptz not null default now(),
  management_token_hash text not null unique check (management_token_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '180 days'),
  check (expires_at > created_at)
);

comment on table public.membership_requests is 'Pedidos demonstrativos de matrícula; retenção máxima de 180 dias.';
comment on column public.membership_requests.full_name is 'PII: identificação e contato da solicitação.';
comment on column public.membership_requests.email is 'PII: contato e exercício de direitos do titular.';
comment on column public.membership_requests.phone is 'PII: contato pela academia.';
comment on column public.membership_requests.management_token_hash is 'Hash SHA-256 do código de gestão entregue uma vez ao titular.';

create index membership_requests_created_at_idx on public.membership_requests (created_at desc);
create index membership_requests_expires_at_idx on public.membership_requests (expires_at);
create index membership_requests_status_idx on public.membership_requests (status, created_at desc);

alter table public.membership_requests enable row level security;
alter table public.membership_requests force row level security;
revoke all on table public.membership_requests from public, anon, authenticated;
grant select, insert, update, delete on table public.membership_requests to service_role;

create table private.request_rate_limits (
  scope text not null,
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null,
  hits integer not null default 1 check (hits between 1 and 5),
  primary key (scope, fingerprint, window_started_at)
);
revoke all on table private.request_rate_limits from public, anon, authenticated;

create or replace function public.consume_membership_request_rate_limit(
  request_scope text,
  request_fingerprint text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_window timestamptz := date_bin(interval '15 minutes', now(), timestamptz '2001-01-01 00:00:00+00');
  accepted boolean;
begin
  if request_scope not in ('submit', 'export', 'delete')
     or request_fingerprint !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  delete from private.request_rate_limits
  where window_started_at < now() - interval '24 hours';

  insert into private.request_rate_limits (scope, fingerprint, window_started_at, hits)
  values (request_scope, request_fingerprint, current_window, 1)
  on conflict (scope, fingerprint, window_started_at)
  do update set hits = private.request_rate_limits.hits + 1
  where private.request_rate_limits.hits < 5
  returning true into accepted;

  return coalesce(accepted, false);
end;
$$;

revoke all on function public.consume_membership_request_rate_limit(text, text) from public, anon, authenticated;
grant execute on function public.consume_membership_request_rate_limit(text, text) to service_role;

create or replace function public.purge_expired_membership_requests()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  delete from public.membership_requests where expires_at <= now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_expired_membership_requests() from public, anon, authenticated;
grant execute on function public.purge_expired_membership_requests() to service_role;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger membership_requests_updated_at
before update on public.membership_requests
for each row execute function private.set_updated_at();
