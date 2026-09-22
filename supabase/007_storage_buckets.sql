-- FretTalk: プロフィール画像・機材写真をアップロードするためのStorageバケットを作成
-- これまでのスキーマを実行済みの環境に「追加」で実行してください。

-- バケット作成(どちらも公開読み取り可能。書き込みは本人のみに制限する)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gear-images', 'gear-images', true)
on conflict (id) do nothing;

-- avatars: 誰でも閲覧可能。アップロード/更新/削除は、パスの先頭フォルダが
-- 自分のuser_idであるファイルのみ許可(例: {user_id}/avatar.png)
drop policy if exists "avatars_select_all" on storage.objects;
create policy "avatars_select_all" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- gear-images: 同様に、誰でも閲覧可能。書き込みは本人のみ
drop policy if exists "gear_images_select_all" on storage.objects;
create policy "gear_images_select_all" on storage.objects
  for select using (bucket_id = 'gear-images');

drop policy if exists "gear_images_insert_own" on storage.objects;
create policy "gear_images_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'gear-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "gear_images_update_own" on storage.objects;
create policy "gear_images_update_own" on storage.objects
  for update using (
    bucket_id = 'gear-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "gear_images_delete_own" on storage.objects;
create policy "gear_images_delete_own" on storage.objects
  for delete using (
    bucket_id = 'gear-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
