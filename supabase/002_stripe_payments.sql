-- FretTalk: Stripe Connect 決済まわりの追加スキーマ
-- schema.sql (v2, Auth連携版)を実行済みの環境に「追加」で実行してください。
-- 既存のusers等のデータは消えません。

-- usersにStripe連携用のカラムを追加
alter table public.users
  add column if not exists stripe_account_id text,
  add column if not exists stripe_payouts_enabled boolean not null default false;

-- stripe_account_id / stripe_payouts_enabled もユーザー自身は書き換え不可にする
-- (schema.sqlで作成済みのprotect_privileged_user_columns関数を上書きするだけでOK。
--  トリガー自体は既に users テーブルに設定済みです)
create or replace function public.protect_privileged_user_columns()
returns trigger
language plpgsql
security definer
as $$
begin
  if auth.role() <> 'service_role' then
    new.is_advisor := old.is_advisor;
    new.advisor_status := old.advisor_status;
    new.points := old.points;
    new.stripe_account_id := old.stripe_account_id;
    new.stripe_payouts_enabled := old.stripe_payouts_enabled;
  end if;
  return new;
end;
$$;

-- 指名添削チケット(質問者 → アドバイザーへの有料依頼)
create table if not exists public.correction_tickets (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.users(id) on delete cascade,
  advisor_id uuid not null references public.users(id) on delete cascade,
  amount_yen integer not null check (amount_yen > 0),
  platform_fee_yen integer not null check (platform_fee_yen >= 0),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'in_progress', 'delivered', 'completed', 'cancelled', 'refunded')),
  memo text,
  video_url text,
  audio_url text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_transfer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 投げ銭
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id uuid not null references public.users(id) on delete cascade,
  log_id uuid references public.practice_logs(id) on delete set null,
  amount_yen integer not null check (amount_yen > 0),
  platform_fee_yen integer not null check (platform_fee_yen >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

-- Stripe Webhookイベントの記録(監査ログ・重複処理防止用。サーバーのみが読み書き)
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_correction_tickets_buyer_id on public.correction_tickets(buyer_id);
create index if not exists idx_correction_tickets_advisor_id on public.correction_tickets(advisor_id);
create index if not exists idx_tips_from_user_id on public.tips(from_user_id);
create index if not exists idx_tips_to_user_id on public.tips(to_user_id);

alter table public.correction_tickets enable row level security;
alter table public.tips enable row level security;
alter table public.payment_events enable row level security;

-- correction_tickets: 当事者(質問者・アドバイザー)のみ閲覧可能。
-- 作成は質問者本人のみ。支払い確定などのステータス変更はサーバー(service_role/Webhook)のみが行う。
drop policy if exists "correction_tickets_select_own" on public.correction_tickets;
create policy "correction_tickets_select_own" on public.correction_tickets
  for select using (auth.uid() = buyer_id or auth.uid() = advisor_id);
drop policy if exists "correction_tickets_insert_own" on public.correction_tickets;
create policy "correction_tickets_insert_own" on public.correction_tickets
  for insert with check (auth.uid() = buyer_id);

-- tips: 当事者のみ閲覧可能。作成は送り主本人のみ。ステータス変更はサーバーのみ。
drop policy if exists "tips_select_own" on public.tips;
create policy "tips_select_own" on public.tips
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
drop policy if exists "tips_insert_own" on public.tips;
create policy "tips_insert_own" on public.tips
  for insert with check (auth.uid() = from_user_id);

-- payment_events はポリシーを追加しない(service_roleのみアクセス可能、通常ユーザーは一切アクセス不可)
