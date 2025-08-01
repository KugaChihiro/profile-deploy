export type RelatedInfoBase = {
  profile_video?: string | null;
  profile_thumbnail_url?:string | null;
  seminar_videos?: string | null;
  seminar_thumbnail_url?:string | null;
};

export type RelatedInfoCreate = {
  employee_id: number | null;
} & RelatedInfoBase;

export type RelatedInfoUpdate = Partial<RelatedInfoBase>;

export type RelatedInfoOut = {
  id: number;
  employee_id: number;
} & RelatedInfoBase;
