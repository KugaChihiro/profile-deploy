export interface ProjectMember {
  project_id: number;
  member_names: string; // カンマ区切りの文字列
}

export interface ProjectInfo {
  id: number;  // 主キーはid
  name: string;
  start_date?: string; // 文字列型
  end_date?: string;   // 文字列型
  industry_categories?: any; // JSON型
  type_categories?: any;     // JSON型
}

export interface ProjectManagementResponse {
  project_members: ProjectMember[];
  projects: ProjectInfo[];
}