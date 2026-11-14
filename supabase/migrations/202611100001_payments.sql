-- Pagamentos online (Stone / plataforma Pagar.me). Scaffold: as tabelas e funções
-- existem, mas nenhuma cobrança real acontece até PAYMENTS_ENABLED e as chaves STONE_*
-- serem configuradas. Toda a escrita é feita pelo service_role (backend), nunca pelo navegador.

-- Estende os escopos de rate limit para incluir tentativas de pagamento.
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
  if request_scope not in ('submit', 'export', 'delete', 'payment')
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

-- Cobranças geradas a partir de um pedido de matrícula.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  membership_request_id uuid references public.membership_requests (id) on delete set null,
  provider text not null default 'stone' check (provider in ('stone')),
  provider_order_id text,
  provider_charge_id text,
  method text not null check (method in ('pix', 'credit_card')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'failed', 'canceled', 'refunded')),
  pix_qr_code text,
  pix_qr_code_url text,
  pix_expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.payments is 'Cobranças online (Stone/Pagar.me). Escrita apenas pelo service_role.';
comment on column public.payments.provider_order_id is 'ID do pedido no provedor (ex.: or_... no Pagar.me).';
comment on column public.payments.provider_charge_id is 'ID da cobrança no provedor (ex.: ch_... no Pagar.me).';
comment on column public.payments.pix_qr_code is 'Payload copia-e-cola do Pix retornado pelo provedor.';

create index payments_membership_request_id_idx on public.payments (membership_request_id);
create index payments_status_idx on public.payments (status, created_at desc);
create unique index payments_provider_order_id_idx
  on public.payments (provider, provider_order_id)
  where provider_order_id is not null;

alter table public.payments enable row level security;
alter table public.payments force row level security;
revoke all on table public.payments from public, anon, authenticated;
grant select, insert, update, delete on table public.payments to service_role;

-- Log de eventos de webhook: auditoria + idempotência (não reprocessa o mesmo evento).
create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stone' check (provider in ('stone')),
  event_id text not null,
  event_type text,
  payment_id uuid references public.payments (id) on delete cascade,
  payload jsonb,
  received_at timestamptz not null default now(),
  unique (provider, event_id)
);

comment on table public.payment_events is 'Eventos de webhook do provedor; a unicidade (provider, event_id) garante idempotência.';

create index payment_events_payment_id_idx on public.payment_events (payment_id);

alter table public.payment_events enable row level security;
alter table public.payment_events force row level security;
revoke all on table public.payment_events from public, anon, authenticated;
grant select, insert, update, delete on table public.payment_events to service_role;

-- Reaproveita a função de updated_at já definida na migração de membership_requests.
create trigger payments_updated_at
before update on public.payments
for each row execute function private.set_updated_at();
