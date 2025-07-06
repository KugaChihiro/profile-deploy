// 共通のベース型
export type PrivateInfoBase = {
  blood_type?: string | null;
  nickname?: string | null;  // カンマ区切り可
  mbti?: string | null;
  family_structure?: string | null;
  father_job?: string | null;
  mother_job?: string | null;
  lessons?: string | null;
  club_activities?: string | null;
  jobs?: string | null;
  circles?: string | null;
  hobbies?: string | null;
  favorite_foods?: string | null;
  disliked_foods?: string | null;
  holiday_activities?: string | null;
  favorite_celebrities?: string | null;
  favorite_characters?: string | null;
  favorite_artists?: string | null;
  favorite_comedians?: string | null;
  activities_free ?: string | null;
  favorite_things_free?: string | null;
};

// 登録時（POST）
export type PrivateInfoCreate = {
  employee_id: number | null;
} & PrivateInfoBase;

// 更新時（PATCH / PUT）
export type PrivateInfoUpdate = Partial<PrivateInfoBase>;

// 取得時（GET）
export type PrivateInfoOut = {
  id: number;
  employee_id: number;
} & PrivateInfoBase;
