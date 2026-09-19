export type AdvisorStatus = "none" | "pending" | "approved" | "rejected";

export type DbUser = {
  id: string;
  name: string;
  avatar_url: string | null;
  points: number;
  is_advisor: boolean;
  advisor_status: AdvisorStatus;
  stripe_payouts_enabled: boolean;
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

export type CorrectionTicketStatus =
  | "pending_payment"
  | "paid"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";

export type DbCorrectionTicket = {
  id: string;
  buyer_id: string;
  advisor_id: string;
  amount_yen: number;
  platform_fee_yen: number;
  status: CorrectionTicketStatus;
  memo: string | null;
  video_url: string | null;
  audio_url: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DbTip = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  log_id: string | null;
  amount_yen: number;
  platform_fee_yen: number;
  status: "pending" | "paid" | "failed" | "refunded";
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
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
