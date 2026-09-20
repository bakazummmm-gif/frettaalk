-- FretTalk: ベストアンサー機能を廃止し、回答への「高評価」機能を追加
-- これまでのスキーマを実行済みの環境に「追加」で実行してください。

-- questions.best_answer_id を削除(ベストアンサー機能を廃止)
alter table public.questions drop constraint if exists questions_best_answer_id_fkey;
alter table public.questions drop column if exists best_answer_id;

-- 回答への高評価。1ユーザー1回答につき1回まで(unique制約で保証)
create table if not exists public.answer_likes (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null references public.answers(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (answer_id, user_id)
);

create index if not exists idx_answer_likes_answer_id on public.answer_likes(answer_id);
create index if not exists idx_answer_likes_user_id on public.answer_likes(user_id);

alter table public.answer_likes enable row level security;

drop policy if exists "answer_likes_select_all" on public.answer_likes;
create policy "answer_likes_select_all" on public.answer_likes for select using (true);
drop policy if exists "answer_likes_insert_own" on public.answer_likes;
create policy "answer_likes_insert_own" on public.answer_likes for insert with check (auth.uid() = user_id);
drop policy if exists "answer_likes_delete_own" on public.answer_likes;
create policy "answer_likes_delete_own" on public.answer_likes for delete using (auth.uid() = user_id);
