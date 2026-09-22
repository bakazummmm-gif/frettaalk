"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/uploadImage";
import { refreshCurrentUser } from "@/lib/userStore";
import Avatar from "@/components/Avatar";

type Props = {
  userId: string;
  name: string;
  avatarUrl: string | null;
};

export default function ProfileAvatarUploader({ userId, name, avatarUrl }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const url = await uploadImage("avatars", userId, "avatar", file);
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: url })
        .eq("id", userId);

      if (updateError) throw updateError;

      await refreshCurrentUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="group relative rounded-full disabled:opacity-60"
      >
        <Avatar name={name} src={avatarUrl} size="lg" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-[10px] font-semibold text-transparent transition-colors group-hover:bg-black/40 group-hover:text-white">
          {isUploading ? "..." : "変更"}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
