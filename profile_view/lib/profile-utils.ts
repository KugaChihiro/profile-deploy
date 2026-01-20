import { EmploymentHistoryOut } from "@/types/employment_history";
import { ProjectInfoOut } from "@/types/project_info";
import { InsightInfoOut } from "@/types/insight_info";
import { SkillInfoOut } from "@/types/skill_info";
import { RelatedInfoOut } from "@/types/related_info";

export type EmploymentHistoryUnit = {
  company_name: string | null;
  job_title?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  knowledge?: string | null;
};

export type ProjectUnit = {
  project: string | null;
  skill?: string | null;
  comment?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type InsightUnit = {
  insight: string | null;
  skill?: string | null;
  comment?: string | null;
};

export type SkillUnit = {
  skill: string | null;
};

export type VideoUnit = {
  video_url: string | undefined;
  thumbnail_url: string | undefined;
};

/**
 * 職歴データをパースして配列形式に変換
 */
export const parseEmploymentHistory = (
  employmentHistory: EmploymentHistoryOut | null
): EmploymentHistoryUnit[] => {
  const names = employmentHistory && (employmentHistory.company_name?.split(",") ?? []);
  const titles = employmentHistory && (employmentHistory.job_title?.split(",") ?? []);
  const s_dates = employmentHistory && (employmentHistory.start_date?.split(",") ?? []);
  const e_dates = employmentHistory && (employmentHistory.end_date?.split(",") ?? []);
  const descriptions = employmentHistory && (employmentHistory.description?.split(",") ?? []);
  const knowledges = employmentHistory && (employmentHistory.knowledge?.split(",") ?? []);

  if (!names || names.length === 0) return [];

  return names.map((name, index) => ({
    company_name: name?.trim() || null,
    job_title: titles?.[index]?.trim() || null,
    start_date: s_dates?.[index]?.trim() || null,
    end_date: e_dates?.[index]?.trim() || null,
    description: descriptions?.[index]?.trim() || null,
    knowledge: knowledges?.[index]?.trim() || null,
  }));
};

/**
 * プロジェクト情報をパースして配列形式に変換
 */
export const parseProjectInfo = (
  projectInfo: ProjectInfoOut | null
): ProjectUnit[] => {
  const projects = projectInfo && (projectInfo.project?.split(",") ?? []);
  const skills = projectInfo && (projectInfo.skill?.split(",") ?? []);
  const comments = projectInfo && (projectInfo.comment?.split(",") ?? []);
  const start_dates = projectInfo && (projectInfo.start_date?.split(",") ?? []);
  const end_dates = projectInfo && (projectInfo.end_date?.split(",") ?? []);

  if (!projects || projects.length === 0) return [];

  return projects.map((proj, index) => ({
    project: proj?.trim() || null,
    skill: skills?.[index]?.trim() || null,
    comment: comments?.[index]?.trim() || null,
    start_date: start_dates?.[index]?.trim() || null,
    end_date: end_dates?.[index]?.trim() || null,
  }));
};

/**
 * 知見情報をパースして配列形式に変換
 */
export const parseInsightInfo = (
  insightInfo: InsightInfoOut | null
): InsightUnit[] => {
  const insights = insightInfo && (insightInfo.insight?.split(",") ?? []);
  const skills = insightInfo && (insightInfo.skill?.split(",") ?? []);
  const comments = insightInfo && (insightInfo.comment?.split(",") ?? []);

  if (!insights || insights.length === 0) return [];

  return insights.map((insight, index) => ({
    insight: insight?.trim() || null,
    skill: skills?.[index]?.trim() || null,
    comment: comments?.[index]?.trim() || null,
  }));
};

/**
 * スキル情報をパースして配列形式に変換
 */
export const parseSkillInfo = (
  skillInfo: SkillInfoOut | null
): SkillUnit[] => {
  const skills = skillInfo && (skillInfo.skill?.split(",") ?? []);

  if (!skills || skills.length === 0) return [];

  return skills.map((skill) => ({
    skill: skill?.trim() || null,
  }));
};

/**
 * セミナー動画情報をパースして配列形式に変換
 */
export const parseSeminarInfo = (
  relatedInfo: RelatedInfoOut | null
): VideoUnit[] => {
  const video_url = relatedInfo && (relatedInfo.seminar_videos?.split(",") ?? []);
  const thumbnail_url = relatedInfo && (relatedInfo.seminar_thumbnail_url?.split(",") ?? []);

  if (!video_url || video_url.length === 0) return [];

  return video_url.map((video_url, index) => ({
    video_url: video_url?.trim() || undefined,
    thumbnail_url: thumbnail_url?.[index]?.trim() || undefined,
  }));
};

/**
 * 日付をローカル形式の文字列に変換 (YYYY-MM-DD)
 */
export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

/**
 * 配列をカンマ区切りの文字列に変換
 */
export const joinWithComma = (arr: (string | null | undefined)[]): string => {
  return arr.map(item => item ?? "").join(",");
};

/**
 * 配列を区切り文字でエスケープして結合（スキルなどで使用）
 */
export const joinWithEscape = (
  arr: (string | null | undefined)[],
  delimiter: string = "\\"
): string => {
  return arr
    .map(item => (item ?? "").split(/[、,]/).join(delimiter))
    .join(",");
};
