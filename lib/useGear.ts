"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { uploadImage } from "./uploadImage";
import { useCurrentUser } from "./userStore";
import type { GearListItem, GearType, MyGearSlot } from "./types";

type MyGearRow = {
  id: string;
  gear_type: GearType;
  brand: string;
  category: string;
  model_name: string;
  comment: string | null;
  image_url: string | null;
};

type AllGearRow = {
  id: string;
  gear_type: GearType;
  brand: string;
  category: string;
  model_name: string;
  comment: string | null;
  image_url: string | null;
  created_at: string;
  users: { name: string; avatar_url: string | null } | null;
};

export function useGear() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const [myGear, setMyGear] = useState<Record<GearType, MyGearSlot | null>>({
    first: null,
    second: null,
  });
  const [allGear, setAllGear] = useState<GearListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (userId?: string) => {
    const [allResult, myResult] = await Promise.all([
      supabase
        .from("my_gear")
        .select(
          "id, gear_type, brand, category, model_name, comment, image_url, created_at, users(name, avatar_url)"
        )
        .order("created_at", { ascending: false }),
      userId
        ? supabase
            .from("my_gear")
            .select("id, gear_type, brand, category, model_name, comment, image_url")
            .eq("user_id", userId)
        : Promise.resolve({ data: [] as MyGearRow[], error: null }),
    ]);

    if (allResult.error) {
      setError(allResult.error.message);
      setIsLoading(false);
      return;
    }

    setAllGear(
      ((allResult.data as unknown as AllGearRow[]) ?? []).map((row) => ({
        id: row.id,
        gearType: row.gear_type,
        brand: row.brand,
        category: row.category,
        modelName: row.model_name,
        comment: row.comment,
        imageUrl: row.image_url,
        author: row.users?.name ?? "ゲスト",
        authorAvatarUrl: row.users?.avatar_url ?? null,
        createdAt: row.created_at,
      }))
    );

    if (myResult.error) {
      setError(myResult.error.message);
    } else {
      const rows = (myResult.data as unknown as MyGearRow[]) ?? [];
      const toSlot = (row: MyGearRow | undefined): MyGearSlot | null =>
        row
          ? {
              id: row.id,
              brand: row.brand,
              category: row.category,
              modelName: row.model_name,
              comment: row.comment,
              imageUrl: row.image_url,
            }
          : null;

      setMyGear({
        first: toSlot(rows.find((row) => row.gear_type === "first")),
        second: toSlot(rows.find((row) => row.gear_type === "second")),
      });
      setError(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isUserLoading) return;
    // Supabaseへの非同期フェッチなので、setStateはawait後の非同期タイミングで呼ばれる
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(user?.id);
  }, [isUserLoading, user, refresh]);

  const saveGear = useCallback(
    async (
      gearType: GearType,
      values: { brand: string; category: string; modelName: string; comment: string }
    ) => {
      if (!user) return;

      const { error: upsertError } = await supabase.from("my_gear").upsert(
        {
          user_id: user.id,
          gear_type: gearType,
          brand: values.brand,
          category: values.category,
          model_name: values.modelName,
          comment: values.comment || null,
        },
        { onConflict: "user_id,gear_type" }
      );

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      await refresh(user.id);
    },
    [user, refresh]
  );

  const saveGearImage = useCallback(
    async (gearType: GearType, file: File) => {
      if (!user) return;

      try {
        const imageUrl = await uploadImage("gear-images", user.id, gearType, file);

        const { error: updateError } = await supabase
          .from("my_gear")
          .update({ image_url: imageUrl })
          .eq("user_id", user.id)
          .eq("gear_type", gearType);

        if (updateError) {
          setError(updateError.message);
          return;
        }

        await refresh(user.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "画像のアップロードに失敗しました");
      }
    },
    [user, refresh]
  );

  return {
    myGear,
    allGear,
    isReady: !isUserLoading && !isLoading,
    error,
    saveGear,
    saveGearImage,
  };
}
