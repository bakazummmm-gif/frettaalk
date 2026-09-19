-- FretTalk 初期スキーマ
-- Supabaseダッシュボード → SQL Editor に貼り付けて実行してください。
-- 実行後、users / my_gear / practice_logs / likes / streaks の5テーブルが作成されます。

-- uuid生成用(Supabaseプロジェクトでは通常デフォルトで有効)
create extension if not exists pgcrypto;

-- 1. users: アプリ利用者
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. my_gear: ユーザーの愛用機材(メイン/サブ)
create table if not exists public.my_gear (
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
create table if not exists public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  duration_minutes integer not null check (duration_minutes > 0),
  memo text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

-- 4. likes: 練習ログへのいいね(1ユーザー1ログにつき1回まで)
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  log_id uuid not null references public.practice_logs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, log_id)
);

-- 5. streaks: 連続記録日数
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  consecutive_days integer not null default 0,
  last_liked_at timestamptz
);

-- 検索性能向上用インデックス
create index if not exists idx_my_gear_user_id on public.my_gear(user_id);
create index if not exists idx_practice_logs_user_id on public.practice_logs(user_id);
create index if not exists idx_practice_logs_created_at on public.practice_logs(created_at desc);
create index if not exists idx_likes_log_id on public.likes(log_id);
create index if not exists idx_likes_user_id on public.likes(user_id);

-- Row Level Security
-- 現時点ではSupabase Authを導入していないため、anonキーからの読み書きを許可する
-- 開発用ポリシーにしています。Authを導入したら user_id = auth.uid() 等に絞ってください。
alter table public.users enable row level security;
alter table public.my_gear enable row level security;
alter table public.practice_logs enable row level security;
alter table public.likes enable row level security;
alter table public.streaks enable row level security;

create policy "users_select_all" on public.users for select using (true);
create policy "users_insert_all" on public.users for insert with check (true);
create policy "users_update_all" on public.users for update using (true);

create policy "my_gear_select_all" on public.my_gear for select using (true);
create policy "my_gear_insert_all" on public.my_gear for insert with check (true);
create policy "my_gear_update_all" on public.my_gear for update using (true);
create policy "my_gear_delete_all" on public.my_gear for delete using (true);

create policy "practice_logs_select_all" on public.practice_logs for select using (true);
create policy "practice_logs_insert_all" on public.practice_logs for insert with check (true);
create policy "practice_logs_update_all" on public.practice_logs for update using (true);
create policy "practice_logs_delete_all" on public.practice_logs for delete using (true);

create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_all" on public.likes for insert with check (true);
create policy "likes_delete_all" on public.likes for delete using (true);

create policy "streaks_select_all" on public.streaks for select using (true);
create policy "streaks_insert_all" on public.streaks for insert with check (true);
create policy "streaks_update_all" on public.streaks for update using (true);

-- ============================================================
-- お試しデータ(任意): タイムラインをすぐ確認したい場合のみ実行してください
-- ============================================================
-- with seed_user as (
--   insert into public.users (name, points) values ('たろう', 1280)
--   returning id
-- )
-- insert into public.practice_logs (user_id, duration_minutes, memo)
-- select id, 45, 'Fメジャーのバレーコードを重点練習。だいぶ音が鳴るようになってきた!' from seed_user
-- union all
-- select id, 20, 'スケール練習(Cメジャー)とメトロノーム60→100でピッキング強化。' from seed_user
-- union all
-- select id, 60, '好きな曲のイントロをコピー。耳コピは時間かかるけど楽しい。' from seed_user;
