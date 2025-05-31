export type ProjectInfoBase = {
  project?: string | null;
  skill?: string | null;
  comment?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type ProjectInfoCreate = {
  employee_id: number | null;
} & ProjectInfoBase;

export type ProjectInfoUpdate = Partial<ProjectInfoBase>;

export type ProjectInfoOut = {
  id: number;
  employee_id: number;
} & ProjectInfoBase;
