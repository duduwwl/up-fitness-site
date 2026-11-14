-- Destrutivo. Execute somente após exportar dados e confirmar que a funcionalidade foi removida.
drop function if exists public.purge_expired_membership_requests();
drop function if exists public.consume_membership_request_rate_limit(text, text);
drop table if exists public.membership_requests;
drop schema if exists private cascade;
