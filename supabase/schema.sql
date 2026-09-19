-- FretTalk スキーマ v2: Supabase Auth連携 + アドバイザー承認制
-- Supabaseダッシュボード → SQL Editor に貼り付けて実行してください。
--
-- v1(認証なし版)を既に実行済みの場合は、下の「クリーンアップ」で
-- 古いテーブルを削除してからこのファイルをまるごと実行してください。
-- (テスト投稿などのデータは消えます)

-- ============================================================
-- クリーンアップ(初回実行時は何も存在しないため無視されます)
-- ============================================================
drop table if exists public.advisor_applications cascade;
drop table if exists public.streaks cascade;
drop table if exists public.likes cascade;
drop table if exists public.practice_logs cascade;
drop table if exists public.my_gear cascade;
drop table if exists public.users cascade;

-- uuid生成用(Supabaseプロジェクトでは通常デフォルトで有効)
create extension if not exists pgcrypto;

-- 1. users: Supabase Auth(auth.users)と1:1で連動するプロフィール
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  points integer not null default 0,
  is_advisor boolean not null default false,
  advisor_status text not null default 'none'
    check (advisor_status in ('none', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- 新規サインアップ(auth.users への insert)があったら自動でpublic.usersにも行を作る
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- is_advisor / advisor_status / points はユーザー自身が書き換えられないように保護。
-- 変更できるのはservice_role(サーバー側の管理操作、またはSupabaseダッシュボードでの手動更新)のみ。
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
  end if;
  return new;
end;
$$;

drop trigger if exists protect_privileged_columns on public.users;
create trigger protect_privileged_columns
  before update on public.users
  for each row execute function public.protect_privileged_user_columns();

-- 2. my_gear: ユーザーの愛用機材(メイン/サブ)
create table public.my_gear (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  gear_type text not null check (gear_type in ('first', 'second')),
  brand text not null,
  category text not null,
  model_name text not null,
  image_url text,
  comment text,
  created_at timestamptz not null default now()
);

-- 3. practice_logs: 練習ログ投稿
create table public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  duration_minutes integer not null check (duration_minutes > 0),
  memo text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

-- 4. likes: 練習ログへのいいね(1ユーザー1ログにつき1回まで)
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_id uuid not null references public.practice_logs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, log_id)
);

-- 5. streaks: 連続記録日数
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  consecutive_days integer not null default 0,
  last_liked_at timestamptz
);

-- 6. advisor_applications: アドバイザー申請(承認は運営が手動で行う)
create table public.advisor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- 検索性能向上用インデックス
create index idx_my_gear_user_id on public.my_gear(user_id);
create index idx_practice_logs_user_id on public.practice_logs(user_id);
create index idx_practice_logs_created_at on public.practice_logs(created_at desc);
create index idx_likes_log_id on public.likes(log_id);
create index idx_likes_user_id on public.likes(user_id);
create index idx_advisor_applications_user_id on public.advisor_applications(user_id);

-- ============================================================
-- Row Level Security: ログインユーザー本人のみ書き込みできるようにする
-- ============================================================
alter table public.users enable row level security;
alter table public.my_gear enable row level security;
alter table public.practice_logs enable row level security;
alter table public.likes enable row level security;
alter table public.streaks enable row level security;
alter table public.advisor_applications enable row level security;

-- users: プロフィール(名前・ポイントなど)は公開閲覧、更新は本人のみ
-- (is_advisor / advisor_status / points は上のトリガーで書き換え不可)
create policy "users_select_all" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- my_gear: 一覧は公開、書き込みは本人のみ
create policy "my_gear_select_all" on public.my_gear for select using (true);
create policy "my_gear_insert_own" on public.my_gear for insert with check (auth.uid() = user_id);
create policy "my_gear_update_own" on public.my_gear for update using (auth.uid() = user_id);
create policy "my_gear_delete_own" on public.my_gear for delete using (auth.uid() = user_id);

-- practice_logs: 一覧は公開、投稿・編集・削除は本人のみ
create policy "practice_logs_select_all" on public.practice_logs for select using (true);
create policy "practice_logs_insert_own" on public.practice_logs for insert with check (auth.uid() = user_id);
create policy "practice_logs_update_own" on public.practice_logs for update using (auth.uid() = user_id);
create policy "practice_logs_delete_own" on public.practice_logs for delete using (auth.uid() = user_id);

-- likes: 一覧は公開、いいね・取り消しは本人のみ
create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- streaks: 本人のみ閲覧・更新可能
create policy "streaks_select_own" on public.streaks for select using (auth.uid() = user_id);
create policy "streaks_insert_own" on public.streaks for insert with check (auth.uid() = user_id);
create policy "streaks_update_own" on public.streaks for update using (auth.uid() = user_id);

-- advisor_applications: 本人のみ閲覧・申請可能(承認/却下は運営がダッシュボードで行う)
create policy "advisor_applications_select_own" on public.advisor_applications for select using (auth.uid() = user_id);
create policy "advisor_applications_insert_own" on public.advisor_applications for insert with check (auth.uid() = user_id);

-- ============================================================
-- アドバイザー承認のやり方(運営 = あなたがSQL Editorで実行)
-- ============================================================
-- 1. 申請一覧を確認:
--   select * from public.advisor_applications where status = 'pending';
--
-- 2. 承認する場合(対象のuser_idを申請一覧から確認して差し替え):
--   update public.users set is_advisor = true, advisor_status = 'approved' where id = '対象のuser_id';
--   update public.advisor_applications set status = 'approved' where user_id = '対象のuser_id';
--
-- 3. 却下する場合:
--   update public.users set advisor_status = 'rejected' where id = '対象のuser_id';
--   update public.advisor_applications set status = 'rejected' where user_id = '対象のuser_id';
