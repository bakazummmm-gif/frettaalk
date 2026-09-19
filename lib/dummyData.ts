import type { PracticeLog } from "./types";

export function createDummyLogs(): PracticeLog[] {
  const now = Date.now();
  return [
    {
      id: "dummy-1",
      author: "たろう",
      minutes: 45,
      memo: "Fメジャーのバレーコードを重点練習。だいぶ音が鳴るようになってきた!",
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
      likes: 3,
      liked: false,
    },
    {
      id: "dummy-2",
      author: "みさき",
      minutes: 20,
      memo: "スケール練習(Cメジャー)とメトロノーム60→100でピッキング強化。",
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      likes: 5,
      liked: true,
    },
    {
      id: "dummy-3",
      author: "けん",
      minutes: 60,
      memo: "好きな曲のイントロをコピー。耳コピは時間かかるけど楽しい。",
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      likes: 2,
      liked: false,
    },
  ];
}
