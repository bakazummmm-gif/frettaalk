-- FretTalk: my_gearを1ユーザー1スロット(メイン/サブ)に制限する
-- これまでのスキーマを実行済みの環境に「追加」で実行してください。

alter table public.my_gear
  drop constraint if exists my_gear_user_gear_type_unique;

alter table public.my_gear
  add constraint my_gear_user_gear_type_unique unique (user_id, gear_type);
