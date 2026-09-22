import { supabase } from "./supabase";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getExtension(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split("/").pop();
  return fromType || "jpg";
}

export async function uploadImage(
  bucket: string,
  folder: string,
  fileName: string,
  file: File
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選んでください");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("5MB以下の画像を選んでください");
  }

  const path = `${folder}/${fileName}.${getExtension(file)}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  // 画像を差し替えてもURLが同じままだとブラウザキャッシュが古い画像を出し続けるため
  return `${data.publicUrl}?t=${Date.now()}`;
}
