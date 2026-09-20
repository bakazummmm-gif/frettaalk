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

// マイページのカレンダーで使う表示用の型(本人の練習ログのみ)
export type PracticeLogView = {
  id: string;
  minutes: number;
  memo: string;
  createdAt: string;
};

export type DbQuestion = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  advisor_only: boolean;
  created_at: string;
};

export type DbAnswer = {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export type DbAnswerLike = {
  id: string;
  answer_id: string;
  user_id: string;
  created_at: string;
};

// ホームの質問一覧カードで使う表示用の型
export type QuestionListItem = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  answerCount: number;
  advisorOnly: boolean;
};

// 回答一覧で使う表示用の型
export type AnswerView = {
  id: string;
  body: string;
  author: string;
  authorId: string;
  createdAt: string;
  likes: number;
  liked: boolean;
};

// 質問詳細で使う表示用の型
export type QuestionDetailView = {
  id: string;
  title: string;
  body: string;
  author: string;
  authorId: string;
  createdAt: string;
  advisorOnly: boolean;
};
