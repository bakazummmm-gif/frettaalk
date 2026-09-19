export type AdvisorStatus = "none" | "pending" | "approved" | "rejected";

export type DbUser = {
  id: string;
  name: string;
  avatar_url: string | null;
  points: number;
  is_advisor: boolean;
  advisor_status: AdvisorStatus;
  created_at: string;
};

export type DbMyGear = {
  id: string;
  user_id: string;
  gear_type: "first" | "second";
  brand: string;
  category: string;
  model_name: string;
  image_url: string | null;
  comment: string | null;
  created_at: string;
};

export type DbPracticeLog = {
  id: string;
  user_id: string;
  duration_minutes: number;
  memo: string;
  image_url: string | null;
  created_at: string;
};

export type DbLike = {
  id: string;
  user_id: string;
  log_id: string;
  created_at: string;
};

export type DbStreak = {
  id: string;
  user_id: string;
  consecutive_days: number;
  last_liked_at: string | null;
};

export type DbAdvisorApplication = {
  id: string;
  user_id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

// タイムラインで使う表示用の型(practice_logs + users + likes を結合したもの)
export type PracticeLogView = {
  id: string;
  author: string;
  minutes: number;
  memo: string;
  createdAt: string;
  likes: number;
  liked: boolean;
};
