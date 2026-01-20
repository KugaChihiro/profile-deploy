import { UseFormReturn } from "react-hook-form"

type FormArrayOperationsProps = {
  form: UseFormReturn<any>
}

export const useFormArrayOperations = ({ form }: FormArrayOperationsProps) => {
  const { watch, setValue } = form

  const skills = watch("skill_info")
  const projects = watch("project_info")
  const workHistory = watch("employment_history")
  const knowledge = watch("insight_info")
  const seminarVideos = watch("seminar_videos")

  // スキル操作
  const addSkill = () => setValue("skill_info", [...(skills || []), { skill: "" }])
  const removeSkill = (index: number) =>
    setValue(
      "skill_info",
      skills.filter((_: any, i: number) => i !== index)
    )

  // 職歴操作
  const addWorkHistory = () =>
    setValue("employment_history", [
      ...(workHistory || []),
      {
        company_name: "",
        job_title: "",
        start_date: undefined,
        end_date: undefined,
        description: "",
        knowledge: "",
      },
    ])
  const removeWorkHistory = (index: number) =>
    setValue(
      "employment_history",
      workHistory.filter((_: any, i: number) => i !== index)
    )

  // 知見操作
  const addKnowledge = () =>
    setValue("insight_info", [...(knowledge || []), { insight: "", comment: "", skill: "" }])
  const removeKnowledge = (index: number) =>
    setValue(
      "insight_info",
      knowledge.filter((_: any, i: number) => i !== index)
    )

  // プロジェクト操作
  const addProject = () => {
    const newProjects = [
      ...(projects || []),
      { project: "", comment: "", skill: "", start_date: undefined, end_date: undefined },
    ]
    setValue("project_info", newProjects)
    return newProjects.length - 1 // 新しいインデックスを返す
  }
  const removeProject = (index: number) => {
    setValue(
      "project_info",
      projects.filter((_: any, i: number) => i !== index)
    )
  }

  // セミナー動画操作
  const addSeminarVideo = () =>
    setValue("seminar_videos", [...(seminarVideos || []), { seminar_videos: "" }])
  const removeSeminarVideo = (index: number) =>
    setValue(
      "seminar_videos",
      seminarVideos.filter((_: any, i: number) => i !== index)
    )

  return {
    // 監視している配列
    skills,
    projects,
    workHistory,
    knowledge,
    seminarVideos,

    // スキル操作
    addSkill,
    removeSkill,

    // 職歴操作
    addWorkHistory,
    removeWorkHistory,

    // 知見操作
    addKnowledge,
    removeKnowledge,

    // プロジェクト操作
    addProject,
    removeProject,

    // セミナー動画操作
    addSeminarVideo,
    removeSeminarVideo,
  }
}
