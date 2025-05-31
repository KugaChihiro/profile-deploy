export type InsightInfoBase = {
  insight?: string | null;
  skill?: string | null;
  comment?: string | null;
};

export type InsightInfoCreate = {
  employee_id: number | null;
} & InsightInfoBase;

export type InsightInfoUpdate = Partial<InsightInfoBase>;

export type InsightInfoOut = {
  id: number;
  employee_id: number;
} & InsightInfoBase;
