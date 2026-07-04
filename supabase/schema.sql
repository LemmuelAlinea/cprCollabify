-- Collabify auth schema (3NF). Run once in the Supabase SQL editor.
-- Roles are a lookup table (no repeated role strings); email lives only in
-- auth.users (no duplication). Safe to re-run: guarded with if-not-exists.

-- Roles lookup table
create table if not exists public.roles (
  id smallserial primary key,
  name text not null unique
);

insert into public.roles (name)
values ('superadmin'), ('bsit_admin'), ('professor'), ('student')
on conflict (name) do nothing;

-- Account status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'account_status') then
    create type public.account_status as enum ('active', 'pending', 'suspended');
  end if;
end $$;

-- Profiles: one row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role_id smallint not null references public.roles (id),
  status public.account_status not null default 'active',
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now()
);

-- Returns the caller's role name; SECURITY DEFINER avoids RLS recursion in policies.
create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.name
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = auth.uid();
$$;

-- Creates the profile on signup; sanitizes role so clients cannot self-assign admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  safe_role text;
  rid smallint;
begin
  safe_role := case when requested in ('professor', 'student') then requested else 'student' end;
  select id into rid from public.roles where name = safe_role;

  insert into public.profiles (id, role_id, status, first_name, last_name)
  values (
    new.id,
    rid,
    case when safe_role = 'professor' then 'pending'::public.account_status
         else 'active'::public.account_status end,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Blocks role/status escalation by ordinary users; allows SQL editor / service role (auth.uid() null).
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role_id is distinct from old.role_id or new.status is distinct from old.status)
     and auth.uid() is not null
     and public.current_role_name() not in ('superadmin', 'bsit_admin') then
    raise exception 'Not allowed to change role or status';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- Row level security
alter table public.roles enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "roles readable by authenticated" on public.roles;
create policy "roles readable by authenticated" on public.roles
  for select to authenticated using (true);

drop policy if exists "select own profile" on public.profiles;
create policy "select own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "admins select all profiles" on public.profiles;
create policy "admins select all profiles" on public.profiles
  for select to authenticated
  using (public.current_role_name() in ('superadmin', 'bsit_admin'));

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "admins update profiles" on public.profiles;
create policy "admins update profiles" on public.profiles
  for update to authenticated
  using (public.current_role_name() in ('superadmin', 'bsit_admin'));

-- Least-privilege grants; profile insert happens only via the definer trigger.
grant select on public.roles to authenticated;
grant select, update on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Seed / admin snippets (run manually as needed).
-- Promote a dashboard-created user to superadmin:
--   update public.profiles
--   set role_id = (select id from public.roles where name = 'superadmin'), status = 'active'
--   where id = (select id from auth.users where email = 'you@example.com');
--
-- Approve a pending professor:
--   update public.profiles set status = 'active'
--   where id = (select id from auth.users where email = 'prof@example.com');
-- ---------------------------------------------------------------------------
