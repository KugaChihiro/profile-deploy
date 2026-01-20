import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { api } from "@/lib/api"
import { EmployeeOut } from "@/types/employee"
import { EmploymentHistoryOut } from "@/types/employment_history"
import { ProjectInfoOut } from "@/types/project_info"
import { InsightInfoOut } from "@/types/insight_info"
import { SkillInfoOut } from "@/types/skill_info"
import { PrivateInfoOut } from "@/types/private_info"
import { RelatedInfoOut } from "@/types/related_info"

export type FormValues = {
  employee_id?: number | null
  name?: string | null
  kana?: string | null
  birthdate?: Date | null
  hometown?: string | null
  photo_url?: string | null
  elementary_school?: string | null
  junior_high_school?: string | null
  high_school?: string | null
  university?: string | null
  faculty?: string | null
  graduate_school?: string | null
  major?: string | null
  employment_history?: Array<{
    company_name?: string | null
    job_title?: string | null
    start_date?: string | null
    end_date?: string | null
    description?: string | null
    knowledge?: string | null
  }>
  project_info?: Array<{
    project?: string | null
    comment?: string | null
    skill?: string | null
    start_date?: string | null
    end_date?: string | null
  }>
  insight_info?: Array<{
    insight?: string | null
    comment?: string | null
    skill?: string | null
  }>
  skill_info?: Array<{
    skill?: string | null
  }>
  blood_type?: string | null
  nickname?: string | null
  mbti?: string | null
  family_structure?: string | null
  father_job?: string | null
  mother_job?: string | null
  lessons?: string | null
  club_activities?: string | null
  jobs?: string | null
  circles?: string | null
  hobbies?: string | null
  favorite_foods?: string | null
  disliked_foods?: string | null
  holiday_activities?: string | null
  favorite_celebrities?: string | null
  favorite_characters?: string | null
  favorite_artists?: string | null
  favorite_comedians?: string | null
  activities_free?: string | null
  favorite_things_free?: string | null
  profile_video?: string | null
  profile_thumbnail_url?: string | null
  seminar_videos?: Array<{
    seminar_videos?: string | null
    seminar_thumbnail_url?: string | null
  }>
}

type UseProfileFormDataProps = {
  id: number
  form: UseFormReturn<any>
  setPreviewUrl: (url: string | null) => void
  setPreviewUrlPV: (url: string | null) => void
  setPreviewSeminarUrls: (urls: (string | null)[]) => void
}

export const useProfileFormData = ({
  id,
  form,
  setPreviewUrl,
  setPreviewUrlPV,
  setPreviewSeminarUrls,
}: UseProfileFormDataProps) => {
  const [employees, setEmployees] = useState<EmployeeOut | null>(null)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryOut | null>(null)
  const [projectInfo, setProjectInfo] = useState<ProjectInfoOut | null>(null)
  const [insightInfo, setInsightInfo] = useState<InsightInfoOut | null>(null)
  const [skillInfo, setSkillInfo] = useState<SkillInfoOut | null>(null)
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoOut | null>(null)
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoOut | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初期データ取得
  useEffect(() => {
    const fetchAll = async () => {
      try {
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
        ])

        setEmployees(resEmployee.data)
        setEmploymentHistory(resEmployment.data)
        setProjectInfo(resProject.data)
        setInsightInfo(resInsight.data)
        setSkillInfo(resSkill.data)
        setPrivateInfo(resPrivate.data)
        setRelatedInfo(resRelated.data)
      } catch (err: any) {
        console.error("データ取得に失敗:", err.response?.data || err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [id])

  // フォームデータの整形とリセット
  useEffect(() => {
    if (employees?.photo_url) {
      setPreviewUrl(employees.photo_url)
    }
    if (relatedInfo?.profile_thumbnail_url) {
      setPreviewUrlPV(relatedInfo.profile_thumbnail_url)
    }

    if (
      employees &&
      employmentHistory &&
      projectInfo &&
      insightInfo &&
      skillInfo &&
      privateInfo &&
      relatedInfo
    ) {
      const formattedValues: FormValues = {
        ...employees,
        birthdate: employees.birthdate ? new Date(employees.birthdate) : undefined,
        ...privateInfo,
        ...relatedInfo,
        employment_history:
          employmentHistory.company_name
            ?.split(",")
            .map((name, index) => ({
              company_name: name,
              job_title: employmentHistory.job_title?.split(",")[index] ?? null,
              start_date: employmentHistory.start_date?.split(",")[index] ?? null,
              end_date: employmentHistory.end_date?.split(",")[index] ?? null,
              description: employmentHistory.description?.split(",")[index] ?? null,
              knowledge:
                employmentHistory.knowledge?.split(",")[index]?.replace(/\\/g, ",") ?? null,
            }))
            .filter((item) => item.company_name) ?? [],
        project_info:
          projectInfo.project
            ?.split(",")
            .map((proj, index) => ({
              project: proj,
              comment: projectInfo.comment?.split(",")[index] ?? null,
              skill: projectInfo.skill?.split(",")[index]?.replace(/\\/g, ",") ?? null,
              start_date: projectInfo.start_date?.split(",")[index] ?? null,
              end_date: projectInfo.end_date?.split(",")[index] ?? null,
            }))
            .filter((item) => item.project) ?? [],
        insight_info:
          insightInfo.insight
            ?.split(",")
            .map((ins, index) => ({
              insight: ins,
              comment: insightInfo.comment?.split(",")[index] ?? null,
              skill: insightInfo.skill?.split(",")[index]?.replace(/\\/g, ",") ?? null,
            }))
            .filter((item) => item.insight) ?? [],
        skill_info:
          skillInfo.skill
            ?.split(",")
            .map((s) => ({ skill: s }))
            .filter((item) => item.skill) ?? [],
        seminar_videos:
          relatedInfo.seminar_videos
            ?.split(",")
            .map((semi, index) => ({
              seminar_videos: semi,
              seminar_thumbnail_url: relatedInfo.seminar_thumbnail_url?.split(",")[index] ?? null,
            }))
            .filter((item) => item.seminar_videos) ?? [],
      }

      const newSeminarThumbnails = formattedValues.seminar_videos?.map(
        (video) => video.seminar_thumbnail_url ?? null
      )

      if (newSeminarThumbnails && newSeminarThumbnails.length > 0) {
        setPreviewSeminarUrls(newSeminarThumbnails)
      }

      form.reset(formattedValues as any)
    }
  }, [
    employees,
    employmentHistory,
    projectInfo,
    insightInfo,
    skillInfo,
    privateInfo,
    relatedInfo,
    form.reset,
    setPreviewUrl,
    setPreviewUrlPV,
    setPreviewSeminarUrls,
  ])

  return {
    employees,
    employmentHistory,
    projectInfo,
    insightInfo,
    skillInfo,
    privateInfo,
    relatedInfo,
    isLoading,
  }
}
