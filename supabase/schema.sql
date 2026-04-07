-- AlignThrive schema for Supabase Postgres
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- -----------------------------------------------------
-- Reset (safe re-run)
-- -----------------------------------------------------
-- This lets you execute the script repeatedly without manual cleanup.

-- Drop storage policies on shared storage.objects table (if they already exist).
drop policy if exists "chat_attachments_participants_read" on storage.objects;
drop policy if exists "chat_attachments_sender_upload" on storage.objects;
drop policy if exists "creator_content_owner_read" on storage.objects;
drop policy if exists "creator_content_owner_upload" on storage.objects;
drop policy if exists "brand_assets_owner_read" on storage.objects;
drop policy if exists "brand_assets_owner_upload" on storage.objects;
drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_auth_upload" on storage.objects;
drop policy if exists "profiles_admin_manage" on public.profiles;
drop policy if exists "brand_profiles_admin_manage" on public.brand_profiles;
drop policy if exists "creator_profiles_admin_manage" on public.creator_profiles;
drop policy if exists "campaigns_admin_manage" on public.campaigns;
drop policy if exists "bids_admin_manage" on public.bids;
drop policy if exists "messages_admin_manage" on public.messages;
drop policy if exists "invitations_admin_manage" on public.invitations;
drop policy if exists "content_submissions_admin_manage" on public.content_submissions;
drop policy if exists "payments_admin_manage" on public.payments;
drop policy if exists "wallet_transactions_admin_manage" on public.wallet_transactions;
drop policy if exists "notifications_admin_manage" on public.notifications;
do $$
begin
  if to_regclass('public.community_requests') is not null then
    execute 'drop policy if exists "community_requests_select_participants" on public.community_requests';
    execute 'drop policy if exists "community_requests_insert_requester" on public.community_requests';
    execute 'drop policy if exists "community_requests_update_participants" on public.community_requests';
    execute 'drop policy if exists "community_requests_admin_manage" on public.community_requests';
  end if;
end $$;

-- Remove objects from buckets first, then buckets using Storage API helpers
-- only if those helper functions exist in the current Supabase version.
do $$
declare
  bucket_name text;
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'storage'
      and p.proname = 'empty_bucket'
  ) then
    foreach bucket_name in array array['chat-attachments', 'creator-content', 'brand-assets', 'avatars']
    loop
      execute 'select storage.empty_bucket($1)' using bucket_name;
    end loop;
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'storage'
      and p.proname = 'delete_bucket'
  ) then
    foreach bucket_name in array array['chat-attachments', 'creator-content', 'brand-assets', 'avatars']
    loop
      execute 'select storage.delete_bucket($1)' using bucket_name;
    end loop;
  end if;
end $$;

-- Drop app tables (policies/triggers/indexes drop with tables because of cascade).
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.notifications cascade;
drop table if exists public.wallet_transactions cascade;
drop table if exists public.payments cascade;
drop table if exists public.content_submissions cascade;
drop table if exists public.invitations cascade;
drop table if exists public.messages cascade;
drop table if exists public.community_requests cascade;
drop table if exists public.bids cascade;
drop table if exists public.campaigns cascade;
drop table if exists public.creator_profiles cascade;
drop table if exists public.brand_profiles cascade;
drop table if exists public.profiles cascade;

-- Drop helper functions and enums so types can be recreated cleanly.
drop function if exists public.set_updated_at() cascade;
drop function if exists public.set_conversation_key() cascade;
drop function if exists public.bump_campaign_bid_count() cascade;
drop function if exists public.apply_wallet_transaction() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;

drop type if exists public.notification_type cascade;
drop type if exists public.message_type cascade;
drop type if exists public.payment_status cascade;
drop type if exists public.bid_status cascade;
drop type if exists public.campaign_status cascade;
drop type if exists public.invitation_status cascade;
drop type if exists public.user_role cascade;

-- -----------------------------------------------------
-- Enums
-- -----------------------------------------------------
create type public.user_role as enum ('admin', 'brand', 'creator');
create type public.campaign_status as enum ('draft', 'open', 'in_review', 'closed', 'completed', 'cancelled');
create type public.bid_status as enum ('applied', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.message_type as enum ('text', 'file', 'link', 'image', 'audio');
create type public.notification_type as enum ('message', 'bid', 'campaign', 'payment', 'system');
create type public.invitation_status as enum ('pending', 'accepted', 'declined', 'expired');

-- -----------------------------------------------------
-- Common trigger helpers
-- -----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_conversation_key()
returns trigger
language plpgsql
as $$
begin
  if new.sender_id::text < new.receiver_id::text then
    new.conversation_key = new.sender_id::text || ':' || new.receiver_id::text;
  else
    new.conversation_key = new.receiver_id::text || ':' || new.sender_id::text;
  end if;
  return new;
end;
$$;

-- -----------------------------------------------------
-- Users / Profiles
-- -----------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  email text not null,
  avatar_url text,
  phone text,
  is_verified boolean not null default false,
  rack_score integer not null default 0,
  chillies_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create table if not exists public.brand_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  website text,
  industry text,
  location text,
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_brand_profiles_updated_at
before update on public.brand_profiles
for each row
execute function public.set_updated_at();

create table if not exists public.creator_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  niche text,
  languages text[] not null default '{}',
  location text,
  instagram_handle text,
  instagram_followers integer not null default 0,
  youtube_channel text,
  youtube_subscribers integer not null default 0,
  tiktok_handle text,
  tiktok_followers integer not null default 0,
  snapchat_handle text,
  snapchat_followers integer not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  combined_audience integer generated always as (
    coalesce(instagram_followers, 0) +
    coalesce(youtube_subscribers, 0) +
    coalesce(tiktok_followers, 0) +
    coalesce(snapchat_followers, 0)
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_creator_profiles_updated_at
before update on public.creator_profiles
for each row
execute function public.set_updated_at();

-- Keep app profile tables in sync for all newly registered auth users,
-- even when email confirmation is enabled and no client session exists yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_text text;
  user_role_value public.user_role;
begin
  user_role_text := lower(coalesce(new.raw_user_meta_data ->> 'role', 'creator'));
  user_role_value :=
    case
      when user_role_text in ('admin', 'brand', 'creator') then user_role_text::public.user_role
      else 'creator'::public.user_role
    end;

  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    user_role_value,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1), 'User'),
    coalesce(new.email, '')
  )
  on conflict (id) do update
    set role = excluded.role,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        email = coalesce(nullif(excluded.email, ''), public.profiles.email),
        updated_at = now();

  if user_role_value = 'brand' then
    insert into public.brand_profiles (id, company_name)
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data ->> 'company_name', ''), 'Brand')
    )
    on conflict (id) do nothing;
  else
    insert into public.creator_profiles (
      id,
      bio,
      niche,
      languages,
      location,
      instagram_handle,
      instagram_followers,
      youtube_channel,
      youtube_subscribers,
      tiktok_handle,
      tiktok_followers,
      snapchat_handle,
      snapchat_followers,
      engagement_rate
    )
    values (
      new.id,
      nullif(new.raw_user_meta_data ->> 'bio', ''),
      nullif(new.raw_user_meta_data ->> 'niche', ''),
      case
        when coalesce(nullif(new.raw_user_meta_data ->> 'language', ''), '') = '' then '{}'::text[]
        else array[new.raw_user_meta_data ->> 'language']
      end,
      nullif(new.raw_user_meta_data ->> 'location', ''),
      nullif(new.raw_user_meta_data ->> 'instagram_handle', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'instagram_followers', '')::integer, 0),
      nullif(new.raw_user_meta_data ->> 'youtube_channel', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'youtube_subscribers', '')::integer, 0),
      nullif(new.raw_user_meta_data ->> 'tiktok_handle', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'tiktok_followers', '')::integer, 0),
      nullif(new.raw_user_meta_data ->> 'snapchat_handle', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'snapchat_followers', '')::integer, 0),
      coalesce(nullif(new.raw_user_meta_data ->> 'engagement_rate', '')::numeric, 2.5)
    )
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Backfill existing auth users that may have been created before this trigger existed.
insert into public.profiles (id, role, full_name, email)
select
  u.id,
  case
    when lower(coalesce(u.raw_user_meta_data ->> 'role', 'creator')) in ('admin', 'brand', 'creator')
      then lower(coalesce(u.raw_user_meta_data ->> 'role', 'creator'))::public.user_role
    else 'creator'::public.user_role
  end as role,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(u.email, ''), '@', 1), 'User') as full_name,
  coalesce(u.email, '') as email
from auth.users u
on conflict (id) do nothing;

insert into public.brand_profiles (id, company_name)
select
  p.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'company_name', ''), 'Brand')
from public.profiles p
join auth.users u on u.id = p.id
left join public.brand_profiles bp on bp.id = p.id
where p.role = 'brand' and bp.id is null;

insert into public.creator_profiles (
  id,
  bio,
  niche,
  languages,
  location,
  instagram_handle,
  instagram_followers,
  youtube_channel,
  youtube_subscribers,
  tiktok_handle,
  tiktok_followers,
  snapchat_handle,
  snapchat_followers,
  engagement_rate
)
select
  p.id,
  nullif(u.raw_user_meta_data ->> 'bio', ''),
  nullif(u.raw_user_meta_data ->> 'niche', ''),
  case
    when coalesce(nullif(u.raw_user_meta_data ->> 'language', ''), '') = '' then '{}'::text[]
    else array[u.raw_user_meta_data ->> 'language']
  end,
  nullif(u.raw_user_meta_data ->> 'location', ''),
  nullif(u.raw_user_meta_data ->> 'instagram_handle', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'instagram_followers', '')::integer, 0),
  nullif(u.raw_user_meta_data ->> 'youtube_channel', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'youtube_subscribers', '')::integer, 0),
  nullif(u.raw_user_meta_data ->> 'tiktok_handle', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'tiktok_followers', '')::integer, 0),
  nullif(u.raw_user_meta_data ->> 'snapchat_handle', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'snapchat_followers', '')::integer, 0),
  coalesce(nullif(u.raw_user_meta_data ->> 'engagement_rate', '')::numeric, 2.5)
from public.profiles p
join auth.users u on u.id = p.id
left join public.creator_profiles cp on cp.id = p.id
where p.role = 'creator' and cp.id is null;

update public.creator_profiles cp
set
  bio = coalesce(nullif(cp.bio, ''), nullif(u.raw_user_meta_data ->> 'bio', '')),
  niche = coalesce(nullif(cp.niche, ''), nullif(u.raw_user_meta_data ->> 'niche', '')),
  languages = case
    when coalesce(array_length(cp.languages, 1), 0) > 0 then cp.languages
    when coalesce(nullif(u.raw_user_meta_data ->> 'language', ''), '') = '' then cp.languages
    else array[u.raw_user_meta_data ->> 'language']
  end,
  location = coalesce(nullif(cp.location, ''), nullif(u.raw_user_meta_data ->> 'location', '')),
  instagram_handle = coalesce(nullif(cp.instagram_handle, ''), nullif(u.raw_user_meta_data ->> 'instagram_handle', '')),
  instagram_followers = case
    when coalesce(cp.instagram_followers, 0) > 0 then cp.instagram_followers
    else coalesce(nullif(u.raw_user_meta_data ->> 'instagram_followers', '')::integer, cp.instagram_followers)
  end,
  youtube_channel = coalesce(nullif(cp.youtube_channel, ''), nullif(u.raw_user_meta_data ->> 'youtube_channel', '')),
  youtube_subscribers = case
    when coalesce(cp.youtube_subscribers, 0) > 0 then cp.youtube_subscribers
    else coalesce(nullif(u.raw_user_meta_data ->> 'youtube_subscribers', '')::integer, cp.youtube_subscribers)
  end,
  tiktok_handle = coalesce(nullif(cp.tiktok_handle, ''), nullif(u.raw_user_meta_data ->> 'tiktok_handle', '')),
  tiktok_followers = case
    when coalesce(cp.tiktok_followers, 0) > 0 then cp.tiktok_followers
    else coalesce(nullif(u.raw_user_meta_data ->> 'tiktok_followers', '')::integer, cp.tiktok_followers)
  end,
  snapchat_handle = coalesce(nullif(cp.snapchat_handle, ''), nullif(u.raw_user_meta_data ->> 'snapchat_handle', '')),
  snapchat_followers = case
    when coalesce(cp.snapchat_followers, 0) > 0 then cp.snapchat_followers
    else coalesce(nullif(u.raw_user_meta_data ->> 'snapchat_followers', '')::integer, cp.snapchat_followers)
  end,
  engagement_rate = case
    when coalesce(cp.engagement_rate, 0) > 0 then cp.engagement_rate
    else coalesce(nullif(u.raw_user_meta_data ->> 'engagement_rate', '')::numeric, cp.engagement_rate)
  end,
  updated_at = now()
from auth.users u
where u.id = cp.id
  and exists (
    select 1
    from public.profiles p
    where p.id = cp.id
      and p.role = 'creator'
  );

-- -----------------------------------------------------
-- Campaigns / Bids
-- -----------------------------------------------------
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  platform text,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  min_followers integer,
  min_engagement_rate numeric(5,2),
  deliverables jsonb not null default '[]'::jsonb,
  deadline date,
  status public.campaign_status not null default 'open',
  priority_chillies_cost integer not null default 20,
  total_bids integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  cover_message text,
  used_chillies boolean not null default false,
  chillies_spent integer not null default 0,
  status public.bid_status not null default 'applied',
  priority_rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create trigger trg_bids_updated_at
before update on public.bids
for each row
execute function public.set_updated_at();

create index if not exists idx_bids_campaign_id on public.bids(campaign_id);
create index if not exists idx_bids_creator_id on public.bids(creator_id);

create or replace function public.bump_campaign_bid_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.campaigns set total_bids = total_bids + 1 where id = new.campaign_id;
  elsif tg_op = 'DELETE' then
    update public.campaigns set total_bids = greatest(total_bids - 1, 0) where id = old.campaign_id;
  end if;
  return null;
end;
$$;

create trigger trg_bids_campaign_count
after insert or delete on public.bids
for each row
execute function public.bump_campaign_bid_count();

-- -----------------------------------------------------
-- Messaging (Realtime)
-- -----------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  conversation_key text not null,
  content text not null,
  content_type public.message_type not null default 'text',
  metadata jsonb,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  message text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> target_id),
  unique (requester_id, target_id)
);

create trigger trg_community_requests_updated_at
before update on public.community_requests
for each row
execute function public.set_updated_at();

create index if not exists idx_community_requests_target_status on public.community_requests(target_id, status, created_at desc);
create index if not exists idx_community_requests_requester_status on public.community_requests(requester_id, status, created_at desc);

create trigger trg_messages_set_conversation_key
before insert or update on public.messages
for each row
execute function public.set_conversation_key();

create trigger trg_messages_updated_at
before update on public.messages
for each row
execute function public.set_updated_at();

create index if not exists idx_messages_sender_receiver on public.messages(sender_id, receiver_id);
create index if not exists idx_messages_receiver_sender on public.messages(receiver_id, sender_id);
create index if not exists idx_messages_conversation_key_created_at on public.messages(conversation_key, created_at);

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end $$;

-- -----------------------------------------------------
-- Invitations / Content / Payments / Wallet
-- -----------------------------------------------------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  brand_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status public.invitation_status not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_invitations_updated_at
before update on public.invitations
for each row
execute function public.set_updated_at();

create table if not exists public.content_submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  caption text,
  media_urls text[] not null default '{}',
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  status text not null default 'submitted'
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  brand_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status public.payment_status not null default 'pending',
  provider text,
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('credit', 'debit')),
  amount integer not null,
  reason text not null,
  ref_type text,
  ref_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_wallet_transactions_user on public.wallet_transactions(user_id, created_at desc);

create or replace function public.apply_wallet_transaction()
returns trigger
language plpgsql
as $$
begin
  if new.direction = 'credit' then
    update public.profiles set chillies_balance = chillies_balance + new.amount where id = new.user_id;
  else
    update public.profiles set chillies_balance = greatest(chillies_balance - new.amount, 0) where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger trg_wallet_transactions_apply
after insert on public.wallet_transactions
for each row
execute function public.apply_wallet_transaction();

-- -----------------------------------------------------
-- Notifications
-- -----------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  data jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_created_at on public.notifications(user_id, created_at desc);

-- -----------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------
alter table public.profiles enable row level security;
alter table public.brand_profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.bids enable row level security;
alter table public.messages enable row level security;
alter table public.invitations enable row level security;
alter table public.content_submissions enable row level security;
alter table public.payments enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.community_requests enable row level security;

-- Profiles
create policy "profiles_select_self_or_public"
on public.profiles
for select
using (true);

create policy "profiles_update_self"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_self"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_admin_manage"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- Brand and creator detail tables
create policy "brand_profiles_select_all"
on public.brand_profiles
for select
using (true);

create policy "brand_profiles_update_owner"
on public.brand_profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "brand_profiles_admin_manage"
on public.brand_profiles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "creator_profiles_select_all"
on public.creator_profiles
for select
using (true);

create policy "creator_profiles_update_owner"
on public.creator_profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "creator_profiles_admin_manage"
on public.creator_profiles
for all
using (public.is_admin())
with check (public.is_admin());

-- Campaigns
create policy "campaigns_select_all"
on public.campaigns
for select
using (true);

create policy "campaigns_insert_brand_owner"
on public.campaigns
for insert
with check (auth.uid() = brand_id);

create policy "campaigns_update_brand_owner"
on public.campaigns
for update
using (auth.uid() = brand_id)
with check (auth.uid() = brand_id);

create policy "campaigns_delete_brand_owner"
on public.campaigns
for delete
using (auth.uid() = brand_id);

create policy "campaigns_admin_manage"
on public.campaigns
for all
using (public.is_admin())
with check (public.is_admin());

-- Bids
create policy "bids_select_owner_participants"
on public.bids
for select
using (
  auth.uid() = creator_id
  or exists (
    select 1
    from public.campaigns c
    where c.id = bids.campaign_id
      and c.brand_id = auth.uid()
  )
);

create policy "bids_insert_creator_owner"
on public.bids
for insert
with check (auth.uid() = creator_id);

create policy "bids_update_creator_or_campaign_brand"
on public.bids
for update
using (
  auth.uid() = creator_id
  or exists (
    select 1
    from public.campaigns c
    where c.id = bids.campaign_id
      and c.brand_id = auth.uid()
  )
);

create policy "bids_admin_manage"
on public.bids
for all
using (public.is_admin())
with check (public.is_admin());

-- Messages (WhatsApp style sender/receiver rules)
create policy "messages_select_participants"
on public.messages
for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_sender_only"
on public.messages
for insert
with check (auth.uid() = sender_id);

create policy "messages_update_receiver_read_status"
on public.messages
for update
using (auth.uid() = receiver_id)
with check (auth.uid() = receiver_id);

create policy "messages_admin_manage"
on public.messages
for all
using (public.is_admin())
with check (public.is_admin());

-- Invitations
create policy "invitations_select_participants"
on public.invitations
for select
using (auth.uid() = brand_id or auth.uid() = creator_id);

create policy "invitations_insert_brand"
on public.invitations
for insert
with check (auth.uid() = brand_id);

create policy "invitations_update_participants"
on public.invitations
for update
using (auth.uid() = brand_id or auth.uid() = creator_id)
with check (auth.uid() = brand_id or auth.uid() = creator_id);

create policy "invitations_admin_manage"
on public.invitations
for all
using (public.is_admin())
with check (public.is_admin());

-- Content submissions
create policy "content_submissions_select_participants"
on public.content_submissions
for select
using (
  auth.uid() = creator_id
  or exists (
    select 1 from public.campaigns c
    where c.id = content_submissions.campaign_id
      and c.brand_id = auth.uid()
  )
);

create policy "content_submissions_insert_creator"
on public.content_submissions
for insert
with check (auth.uid() = creator_id);

create policy "content_submissions_update_creator_or_campaign_brand"
on public.content_submissions
for update
using (
  auth.uid() = creator_id
  or exists (
    select 1 from public.campaigns c
    where c.id = content_submissions.campaign_id
      and c.brand_id = auth.uid()
  )
);

create policy "content_submissions_admin_manage"
on public.content_submissions
for all
using (public.is_admin())
with check (public.is_admin());

-- Payments
create policy "payments_select_participants"
on public.payments
for select
using (auth.uid() = brand_id or auth.uid() = creator_id);

create policy "payments_insert_brand"
on public.payments
for insert
with check (auth.uid() = brand_id);

create policy "payments_admin_manage"
on public.payments
for all
using (public.is_admin())
with check (public.is_admin());

-- Wallet
create policy "wallet_transactions_select_self"
on public.wallet_transactions
for select
using (auth.uid() = user_id);

create policy "wallet_transactions_insert_self"
on public.wallet_transactions
for insert
with check (auth.uid() = user_id);

create policy "wallet_transactions_admin_manage"
on public.wallet_transactions
for all
using (public.is_admin())
with check (public.is_admin());

-- Notifications
create policy "notifications_select_self"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "notifications_update_self"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notifications_admin_manage"
on public.notifications
for all
using (public.is_admin())
with check (public.is_admin());

-- Community requests
create policy "community_requests_select_participants"
on public.community_requests
for select
using (auth.uid() = requester_id or auth.uid() = target_id);

create policy "community_requests_insert_requester"
on public.community_requests
for insert
with check (auth.uid() = requester_id);

create policy "community_requests_update_participants"
on public.community_requests
for update
using (auth.uid() = requester_id or auth.uid() = target_id)
with check (auth.uid() = requester_id or auth.uid() = target_id);

create policy "community_requests_admin_manage"
on public.community_requests
for all
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------
-- Storage Buckets (required)
-- -----------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('chat-attachments', 'chat-attachments', false),
  ('creator-content', 'creator-content', false),
  ('brand-assets', 'brand-assets', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies
create policy "chat_attachments_participants_read"
on storage.objects
for select
using (bucket_id = 'chat-attachments' and auth.role() = 'authenticated');

create policy "chat_attachments_sender_upload"
on storage.objects
for insert
with check (bucket_id = 'chat-attachments' and auth.role() = 'authenticated');

create policy "creator_content_owner_read"
on storage.objects
for select
using (bucket_id = 'creator-content' and auth.role() = 'authenticated');

create policy "creator_content_owner_upload"
on storage.objects
for insert
with check (bucket_id = 'creator-content' and auth.role() = 'authenticated');

create policy "brand_assets_owner_read"
on storage.objects
for select
using (bucket_id = 'brand-assets' and auth.role() = 'authenticated');

create policy "brand_assets_owner_upload"
on storage.objects
for insert
with check (bucket_id = 'brand-assets' and auth.role() = 'authenticated');

create policy "avatars_public_read"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "avatars_auth_upload"
on storage.objects
for insert
with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
