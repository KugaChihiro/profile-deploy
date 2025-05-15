// types/employee.ts

// 共通の Employee 情報
export type EmployeeBase = {
  name?: string | null;
  kana?: string | null;
  birthdate?: string | null; // ISO日付文字列
  hometown?: string | null;
  elementary_school?: string | null;
  junior_high_school?: string | null;
  high_school?: string | null;
  university?: string | null;
  faculty?: string | null;
  graduate_school?: string | null;
  major?: string | null;
  photo_url?: string | null;
};

// 作成時（POST）
export type EmployeeCreate = {
  id: number;
  employee_id: number;
} & Required<Pick<EmployeeBase, 'name' | 'kana' | 'birthdate'>> &
  Omit<EmployeeBase, 'name' | 'kana' | 'birthdate'>;

// 更新時（PUT）
export type EmployeeUpdate = Partial<EmployeeBase>;

// 取得時（GET）
export type EmployeeOut = {
  id: number;
  employee_id: number;
} & EmployeeBase;
