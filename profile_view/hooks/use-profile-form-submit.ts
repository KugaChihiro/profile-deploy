import { api } from "@/lib/api";
import { toLocalDateString, joinWithComma, joinWithEscape } from "@/lib/profile-utils";

export interface FormValues {
  employee_id?: string | number | null;
  name?: string | null;
  kana?: string | null;
  birthdate?: Date | null;
  hometown?: string | null;
  photo_url?: string | null;
  elementary_school?: string | null;
  junior_high_school?: string | null;
  high_school?: string | null;
  university?: string | null;
  faculty?: string | null;
  graduate_school?: string | null;
  major?: string | null;
  employment_history?: Array<{
    company_name?: string | null;
    job_title?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
    knowledge?: string | null;
  }>;
  project_info?: Array<{
    project?: string | null;
    comment?: string | null;
    skill?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  }>;
  insight_info?: Array<{
    insight?: string | null;
    comment?: string | null;
    skill?: string | null;
  }>;
  skill_info?: Array<{
    skill?: string | null;
  }>;
  blood_type?: string | null;
  nickname?: string | null;
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
  activities_free?: string | null;
  favorite_things_free?: string | null;
  profile_video?: string | null;
  profile_thumbnail_url?: string | null;
  seminar_videos?: Array<{
    seminar_videos?: string | null;
    seminar_thumbnail_url?: string | null;
  }>;
}

/**
 * フォームデータを各エンドポイントに送信するためのユーティリティ
 */
export const useProfileFormSubmit = (id: number) => {
  /**
   * 従業員基本情報を送信
   */
  const submitEmployeeInfo = (data: FormValues) => {
    const {
      employee_id,
      name,
      kana,
      birthdate,
      hometown,
      photo_url,
      elementary_school,
      junior_high_school,
      high_school,
      university,
      faculty,
      graduate_school,
      major,
    } = data;

    const payload = {
      employee_id,
      name,
      kana,
      birthdate: birthdate ? toLocalDateString(birthdate) : undefined,
      hometown,
      photo_url,
      elementary_school,
      junior_high_school,
      high_school,
      university,
      faculty,
      graduate_school,
      major,
    };

    return api.put(`/employees/${id}`, payload);
  };

  /**
   * 職歴情報を送信
   */
  const submitEmploymentHistory = (data: FormValues) => {
    const historyArray = data.employment_history || [];

    const payload = {
      company_name: joinWithComma(historyArray.map((h) => h.company_name ?? "")),
      job_title: joinWithComma(historyArray.map((h) => h.job_title ?? "")),
      start_date: historyArray
        .map((h) =>
          h.start_date ? new Date(h.start_date).toISOString().split("T")[0] : null
        )
        .filter((d) => d !== null)
        .join(","),
      end_date: historyArray
        .map((h) =>
          h.end_date ? new Date(h.end_date).toISOString().split("T")[0] : null
        )
        .filter((d) => d !== null)
        .join(","),
      description: joinWithComma(historyArray.map((h) => h.description ?? "")),
      knowledge: historyArray
        .map((h) => (h.knowledge ?? "").split(/[、,]/).join("\\"))
        .join(","),
    };

    return api.put(`/employment_history/${id}`, payload);
  };

  /**
   * プロジェクト情報を送信
   */
  const submitProjectInfo = (data: FormValues) => {
    const projectArray = data.project_info || [];

    const payload = {
      project: joinWithComma(projectArray.map((p) => p.project ?? "")),
      skill: projectArray
        .map((p) => (p.skill ?? "").split(/[、,]/).join("\\"))
        .join(","),
      comment: joinWithComma(projectArray.map((p) => p.comment ?? "")),
      start_date: projectArray
        .map((p) => (p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : ""))
        .join(","),
      end_date: projectArray
        .map((p) => (p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : ""))
        .join(","),
    };

    return api.put(`/project_info/${id}`, payload);
  };

  /**
   * 知見情報を送信
   */
  const submitInsightInfo = (data: FormValues) => {
    const insightArray = data.insight_info || [];

    const payload = {
      comment: joinWithComma(insightArray.map((i) => i.comment ?? "")),
      skill: insightArray
        .map((p) => (p.skill ?? "").split(/[、,]/).join("\\"))
        .join(","),
      insight: joinWithComma(insightArray.map((i) => i.insight ?? "")),
    };

    return api.put(`/insight_info/${id}`, payload);
  };

  /**
   * スキル情報を送信
   */
  const submitSkillInfo = (data: FormValues) => {
    const skillArray = data.skill_info || [];

    const payload = {
      skill: joinWithComma(skillArray.map((s) => s.skill ?? "")),
    };

    return api.put(`/skill_info/${id}`, payload);
  };

  /**
   * プライベート情報を送信
   */
  const submitPrivateInfo = (data: FormValues) => {
    const {
      blood_type,
      nickname,
      mbti,
      family_structure,
      father_job,
      mother_job,
      lessons,
      club_activities,
      jobs,
      circles,
      hobbies,
      favorite_foods,
      disliked_foods,
      holiday_activities,
      favorite_celebrities,
      favorite_characters,
      favorite_artists,
      favorite_comedians,
      activities_free,
      favorite_things_free,
    } = data;

    const payload = {
      blood_type,
      nickname,
      mbti,
      family_structure,
      father_job,
      mother_job,
      lessons,
      club_activities,
      jobs,
      circles,
      hobbies,
      favorite_foods,
      disliked_foods,
      holiday_activities,
      favorite_celebrities,
      favorite_characters,
      favorite_artists,
      favorite_comedians,
      activities_free,
      favorite_things_free,
    };

    return api.put(`/private_info/${id}`, payload);
  };

  /**
   * 関連情報（動画など）を送信
   */
  const submitRelatedInfo = (data: FormValues) => {
    const seminarArray = data.seminar_videos || [];

    const formattedSeminarVideos = seminarArray
      .map((video) => video.seminar_videos ?? "")
      .filter((url) => url !== "")
      .join(",");

    const formattedThumbnailUrls = seminarArray
      .map((video) => video.seminar_thumbnail_url ?? "")
      .join(",");

    const payload = {
      profile_video: data.profile_video,
      profile_thumbnail_url: data.profile_thumbnail_url,
      seminar_videos: formattedSeminarVideos,
      seminar_thumbnail_url: formattedThumbnailUrls,
    };

    return api.put(`/related_info/${id}`, payload);
  };

  /**
   * すべての情報を一括送信
   */
  const submitAllData = async (data: FormValues) => {
    try {
      await Promise.all([
        submitEmployeeInfo(data),
        submitEmploymentHistory(data),
        submitProjectInfo(data),
        submitInsightInfo(data),
        submitSkillInfo(data),
        submitPrivateInfo(data),
        submitRelatedInfo(data),
      ]);
      return { success: true };
    } catch (error) {
      console.error("保存に失敗しました:", error);
      return { success: false, error };
    }
  };

  return {
    submitEmployeeInfo,
    submitEmploymentHistory,
    submitProjectInfo,
    submitInsightInfo,
    submitSkillInfo,
    submitPrivateInfo,
    submitRelatedInfo,
    submitAllData,
  };
};
