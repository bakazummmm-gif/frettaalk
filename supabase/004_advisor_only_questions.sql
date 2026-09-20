-- FretTalk: 質問に「アドバイザーのみ回答可」フラグを追加
-- これまでのスキーマを実行済みの環境に「追加」で実行してください。既存データは消えません。

alter table public.questions
  add column if not exists advisor_only boolean not null default false;

-- answersの投稿ポリシーを更新: advisor_only な質問には、承認済みアドバイザーしか回答できない
drop policy if exists "answers_insert_own" on public.answers;
create policy "answers_insert_own" on public.answers
  for insert
  with check (
    auth.uid() = user_id
    and (
      not exists (
        select 1 from public.questions q
        where q.id = question_id and q.advisor_only = true
      )
      or exists (
        select 1 from public.users u
        where u.id = auth.uid() and u.is_advisor = true
      )
    )
  );
