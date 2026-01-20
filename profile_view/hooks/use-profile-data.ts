import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { EmployeeOut } from "@/types/employee";
import { EmploymentHistoryOut } from "@/types/employment_history";
import { ProjectInfoOut } from "@/types/project_info";
import { InsightInfoOut } from "@/types/insight_info";
import { SkillInfoOut } from "@/types/skill_info";
import { PrivateInfoOut } from "@/types/private_info";
import { RelatedInfoOut } from "@/types/related_info";
import { ProjectInfo, ProjectMember } from "@/types/project_management";

export const useProfileData = (id: number) => {
  const [employees, setEmployees] = useState<EmployeeOut | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryOut | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoOut | null>(null);
  const [insightInfo, setInsightInfo] = useState<InsightInfoOut | null>(null);
  const [skillInfo, setSkillInfo] = useState<SkillInfoOut | null>(null);
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoOut | null>(null);
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoOut | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [managementProjects, setManagementProjects] = useState<ProjectInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [
          resEmployee,
          resEmployment,
          resProject,
          resInsight,
          resSkill,
          resPrivate,
          resRelated,
        ] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get(`/employment_history/${id}`),
          api.get(`/project_info/${id}`),
          api.get(`/insight_info/${id}`),
          api.get(`/skill_info/${id}`),
          api.get(`/private_info/${id}`),
          api.get(`/related_info/${id}`),
        ]);

        setEmployees(resEmployee.data);
        setEmploymentHistory(resEmployment.data);
        setProjectInfo(resProject.data);
        setInsightInfo(resInsight.data);
        setSkillInfo(resSkill.data);
        setPrivateInfo(resPrivate.data);
        setRelatedInfo(resRelated.data);

        // 従業員名が取得できたら、プロジェクト管理データベースからも情報を取得
        if (resEmployee.data?.name) {
          try {
            console.log('従業員名:', resEmployee.data.name);
            // 1. チームメンバー情報を取得
            const resTeamMembers = await api.get(
              `/project-management/team-members/${resEmployee.data.name}`
            );
            console.log('チームメンバー取得結果:', resTeamMembers.data);
            setProjectMembers(resTeamMembers.data);

            // 2. プロジェクトIDを抽出
            const projectIds = resTeamMembers.data.map(
              (member: ProjectMember) => member.project_id
            );
            console.log('プロジェクトID一覧:', projectIds);

            if (projectIds.length > 0) {
              // 3. プロジェクト情報を取得
              const resManagementProjects = await api.get(
                `/project-management/projects?project_ids=${projectIds.join(",")}`
              );
              console.log('プロジェクト情報取得結果:', resManagementProjects.data);
              setManagementProjects(resManagementProjects.data);
            }
          } catch (projectErr) {
            console.warn("プロジェクト管理データの取得に失敗:", projectErr);
            // プロジェクト管理データの取得失敗は致命的エラーではないため、続行
          }
        } else {
          console.log('従業員名が取得できませんでした');
        }
      } catch (err: any) {
        console.error("データ取得に失敗:", err.response?.data || err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  return {
    employees,
    employmentHistory,
    projectInfo,
    insightInfo,
    skillInfo,
    privateInfo,
    relatedInfo,
    projectMembers,
    managementProjects,
    isLoading,
    error,
  };
};
