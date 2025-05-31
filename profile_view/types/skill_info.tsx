export type SkillInfoBase = {
  skill?: string | null;
};

export type SkillInfoCreate = {
  employee_id: number | null;
} & SkillInfoBase;

export type SkillInfoUpdate = Partial<SkillInfoBase>;

export type SkillInfoOut = {
  id: number;
  employee_id: number;
} & SkillInfoBase;
