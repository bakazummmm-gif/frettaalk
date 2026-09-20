-- FretTalk: ホームをQ&A化し、練習ログを非公開(本人のみ)に変更する追加スキーマ
-- これまでのschema.sql / 002_stripe_payments.sql を実行済みの環境に「追加」で実行してください。
-- 既存データは消えません。

-- 質問
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  best_answer_id uuid,
  created_at timestamptz not null default now()
);

-- 回答
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- questions.best_answer_id → answers.id の外部キー(テーブル作成後に追加)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'questions_best_answer_id_fkey'
  ) then
    alter table public.questions
      add constraint questions_best_answer_id_fkey
      foreign key (best_answer_id) references public.answers(id) on delete set null;
  end if;
end $$;

create index if not exists idx_questions_user_id on public.questions(user_id);
create index if not exists idx_questions_created_at on public.questions(created_at desc);
create index if not exists idx_answers_question_id on public.answers(question_id);
create index if not exists idx_answers_user_id on public.answers(user_id);

alter table public.questions enable row level security;
alter table public.answers enable row level security;

-- questions: 一覧・詳細は誰でも見られる。投稿・編集(ベストアンサー選定含む)・削除は質問者本人のみ。
drop policy if exists "questions_select_all" on public.questions;
create policy "questions_select_all" on public.questions for select using (true);
drop policy if exists "questions_insert_own" on public.questions;
create policy "questions_insert_own" on public.questions for insert with check (auth.uid() = user_id);
drop policy if exists "questions_update_own" on public.questions;
create policy "questions_update_own" on public.questions for update using (auth.uid() = user_id);
drop policy if exists "questions_delete_own" on public.questions;
create policy "questions_delete_own" on public.questions for delete using (auth.uid() = user_id);

-- answers: 一覧は誰でも見られる。投稿・削除は回答者本人のみ。
drop policy if exists "answers_select_all" on public.answers;
create policy "answers_select_all" on public.answers for select using (true);
drop policy if exists "answers_insert_own" on public.answers;
create policy "answers_insert_own" on public.answers for insert with check (auth.uid() = user_id);
drop policy if exists "answers_delete_own" on public.answers;
create policy "answers_delete_own" on public.answers for delete using (auth.uid() = user_id);

-- practice_logsを非公開化: 今までは誰でも閲覧できたが、本人のみ閲覧できるように変更
-- (タイムラインへの公開投稿ではなく、マイページの個人カレンダー用データにするため)
drop policy if exists "practice_logs_select_all" on public.practice_logs;
drop policy if exists "practice_logs_select_own" on public.practice_logs;
create policy "practice_logs_select_own" on public.practice_logs for select using (auth.uid() = user_id);
