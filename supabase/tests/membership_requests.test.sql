begin;
select plan(17);

select has_table('public', 'membership_requests', 'membership_requests exists');
select has_column('public', 'membership_requests', 'expires_at', 'retention timestamp exists');
select row_security_active('public.membership_requests'::regclass, 'RLS is active');

set local role anon;
select is_empty(
  $$ select * from public.membership_requests $$,
  'anonymous visitor cannot read private requests'
);
select throws_ok(
  $$ insert into public.membership_requests (plan_slug, full_name, email, phone, payment_method, consent_version, management_token_hash)
     values ('economico', 'Pessoa Teste', 'teste@example.com', '5535999999999', 'pix', '2026-11-08', repeat('a', 64)) $$,
  '42501', null, 'anonymous visitor cannot insert'
);
reset role;

set local role authenticated;
select is_empty(
  $$ select * from public.membership_requests $$,
  'authenticated client cannot read private requests'
);
select throws_ok(
  $$ delete from public.membership_requests $$,
  '42501', null, 'authenticated client cannot delete'
);
reset role;

set local role service_role;
insert into public.membership_requests (id, plan_slug, full_name, email, phone, payment_method, consent_version, management_token_hash)
values ('00000000-0000-4000-8000-000000000001', 'economico', 'Pessoa Teste', 'teste@example.com', '5535999999999', 'pix', '2026-11-08', repeat('a', 64));
select results_eq(
  $$ select plan_slug from public.membership_requests where id = '00000000-0000-4000-8000-000000000001' $$,
  array['economico'::text], 'backend can read inserted request'
);
select throws_ok(
  $$ update public.membership_requests set plan_slug = 'injection''; drop table public.membership_requests; --' where id = '00000000-0000-4000-8000-000000000001' $$,
  '23514', null, 'plan allowlist blocks injection payload'
);
select throws_ok(
  $$ insert into public.membership_requests (plan_slug, full_name, email, phone, payment_method, consent_version, management_token_hash)
     values ('economico', 'X', 'BAD@EXAMPLE.COM', '1', 'cash', 'old', repeat('b', 64)) $$,
  '23514', null, 'database constraints reject invalid fields'
);
select ok(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), 'rate limit accepts attempt 1');
select ok(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), 'rate limit accepts attempt 2');
select ok(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), 'rate limit accepts attempt 3');
select ok(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), 'rate limit accepts attempt 4');
select ok(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), 'rate limit accepts attempt 5');
select isnt(public.consume_membership_request_rate_limit('submit', repeat('c', 64)), true, 'rate limit rejects attempt 6');
select is(public.purge_expired_membership_requests(), 0, 'purge leaves current records');
reset role;

select * from finish();
rollback;
