// EmploymentHistoryBase の共通部分
export type EmploymentHistoryBase = {
  company_name?: string | null;
  job_title?: string | null;
  start_date?: string | null;  // ISO日付文字列を想定
  end_date?: string | null;
  description?: string | null;
  knowledge?: string | null;
};

// 作成時（POST）
export type EmploymentHistoryCreate =  {
  employee_id: number | null;
} & EmploymentHistoryBase;

// 更新時（PUT）
// 全てオプショナル（部分更新用）
export type EmploymentHistoryUpdate  = Partial<EmploymentHistoryBase>;

// 取得時（GET）
export type EmploymentHistoryOut =  {
  id: number;
  employee_id: number;
} & EmploymentHistoryBase;
