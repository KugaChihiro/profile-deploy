"use client"

import type React from "react"

import { useState, useEffect, type FC } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { EmployeeOut, EmployeeUpdate } from "@/types/employee"
import { EmploymentHistoryOut,EmploymentHistoryUpdate} from "@/types/employment_history";
import { ProjectInfoOut,ProjectInfoUpdate } from "@/types/project_info";
import { InsightInfoOut,InsightInfoUpdate } from "@/types/insight_info";
import { SkillInfoOut,SkillInfoUpdate } from "@/types/skill_info";
import { PrivateInfoOut,PrivateInfoUpdate } from "@/types/private_info";
import { RelatedInfoOut,RelatedInfoUpdate } from "@/types/related_info";
import {
  User,
  Briefcase,
  Heart,
  Film,
  CalendarIcon,
  Plus,
  X,
  Upload,
  ChevronRight,
  ChevronLeft,
  Save,
} from "lucide-react"

// フォームのスキーマ定義

// 基本情報
const formSchema = z.object({
  employee_id: z.number().optional().nullable(),
  name: z.string().optional().nullable(),
  kana: z.string().optional().nullable(),
  birthdate: z.date().optional().nullable(),
  hometown: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  elementary_school: z.string().optional().nullable(),
  junior_high_school: z.string().optional().nullable(),
  high_school: z.string().optional().nullable(),
  university: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  graduate_school: z.string().optional().nullable(),
  major: z.string().optional().nullable(),

// 職務情報
  employment_history: z
    .array(
      z.object({
        company_name: z.string().optional().nullable(),
        job_title: z.string().optional().nullable(),
        start_date: z.string().optional().nullable(),
        end_date: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        knowledge: z.string().optional().nullable(),
      }),
    )
    .default([]),

// 業務情報
  project_info: z
    .array(
      z.object({
        project: z.string().optional().nullable(),
        comment: z.string().optional().nullable(),
        skill: z.string().optional().nullable(),
        start_date: z.string().optional().nullable(),
        end_date: z.string().optional().nullable(),
      }),
    )
    .default([]),

// 知見情報
  insight_info: z
    .array(
      z.object({
        insight: z.string().optional().nullable(),
        comment: z.string().optional().nullable(),
        skill: z.string().optional().nullable(),
      }),
    )
    .default([]),

// スキル情報
  skill_info: z
    .array(
      z.object({
        skill: z.string().optional().nullable(),
      }),
    )
    .default([]),

// プライベート情報
  blood_type: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  mbti: z.string().optional().nullable(),
  family_structure: z.string().optional().nullable(),
  father_job: z.string().optional().nullable(),
  mother_job: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  club_activities: z.string().optional().nullable(),
  jobs: z.string().optional().nullable(),
  circles: z.string().optional().nullable(),
  hobbies: z.string().optional().nullable(),
  favorite_foods: z.string().optional().nullable(),
  disliked_foods: z.string().optional().nullable(),
  holiday_activities: z.string().optional().nullable(),
  favorite_celebrities: z.string().optional().nullable(),
  favorite_characters: z.string().optional().nullable(),
  favorite_artists: z.string().optional().nullable(),
  favorite_comedians: z.string().optional().nullable(),

 // 関連情報
  profile_video: z.string().optional().nullable(),
  seminar_videos: z
    .array(
      z.object({
        seminar_videos: z.string().optional().nullable(),
      }),
    )
    .default([]),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  id: number
}

const ProfileForm: FC<Props> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("basic")
  const [newSkill, setNewSkill] = useState("")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [employees, setEmployees] = useState<EmployeeOut | null>(null)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryOut | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoOut | null>(null);
  const [insightInfo, setInsightInfo] = useState<InsightInfoOut | null>(null);
  const [skillInfo, setSkillInfo] = useState<SkillInfoOut | null>(null);
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoOut | null>(null);
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoOut | null>(null);


  let values: FormValues

  // フォームの初期化

  const saved = typeof window !== "undefined" ? localStorage.getItem("profile-form") : null
  if (saved) {
    const parsed = JSON.parse(saved)

    if (parsed.birthdate && typeof parsed.birthdate === "string") {
      const date = new Date(parsed.birthdate)
      parsed.birthdate = isNaN(date.getTime()) ? undefined : date
    }

    if (Array.isArray(parsed.seminarVideos)) {
      parsed.seminarVideos = parsed.seminarVideos.map((s: any) => ({
        ...s,
        date: s.date ? new Date(s.date) : undefined,
      }))
    }

    values = parsed
  } else {
    values = {
      // 基本情報
      employee_id: employees?.employee_id,
      name: "",
      kana: "",
      birthdate: undefined,
      hometown: "",
      // 学歴
      elementary_school: "",
      junior_high_school: "",
      high_school: "",
      university: "",
      faculty: "",
      graduate_school: "",
      major: "",
      photo_url: "",
      // プライベート
      blood_type: "",
      nickname: "",
      mbti: "",
      family_structure: "",
      father_job: "",
      mother_job: "",
      lessons: "",
      club_activities: "",
      jobs: "",
      circles: "",
      hobbies: "",
      favorite_foods: "",
      disliked_foods: "",
      holiday_activities: "",
      favorite_celebrities: "",
      favorite_characters: "",
      favorite_artists: "",
      favorite_comedians: "",
      employment_history: employmentHistory ? [employmentHistory]: [],
      project_info:projectInfo ? [projectInfo] : [],
      insight_info:insightInfo ? [insightInfo] : [],
      skill_info:skillInfo ? [skillInfo] : [],
      seminar_videos:[],
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
  })

  // フォームの値を取得
  const { watch, setValue } = form
  const skills = watch("skill_info")
  const projects = watch("project_info")
  const workHistory = watch("employment_history")
  const knowledge = watch("insight_info")
  const seminarVideos = watch("seminar_videos")

  useEffect(() => {

    api.get(`/employees/${id}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error("基本情報の保存に失敗:", err.response?.data || err));

    api.get(`/employment_history/${id}`)
      .then((res) => {
        setEmploymentHistory(res.data);
      })
      .catch((err) => console.error("職歴の保存に失敗:", err.response?.data || err));

    api.get(`/project_info/${id}`)
      .then((res) => {
        setProjectInfo(res.data);
      })
      .catch((err) => console.error("プロジェクトの保存に失敗:", err.response?.data || err));

    api.get(`/insight_info/${id}`)
      .then((res) => {
        setInsightInfo(res.data);
      })
      .catch((err) => console.error("知見の保存に失敗:", err.response?.data || err));

    api.get(`/skill_info/${id}`)
      .then((res) => {
        setSkillInfo(res.data);
      })
      .catch((err) => console.error("スキルの保存に失敗:", err.response?.data || err));

    api.get(`/private_info/${id}`)
      .then((res) => {
        setPrivateInfo(res.data);
      })
      .catch((err) => console.error("プライベートの保存に失敗:", err.response?.data || err));

    api.get(`/related_info/${id}`)
      .then((res) => {
        setRelatedInfo(res.data);
      })
      .catch((err) => console.error("関連情報の保存に失敗:", err.response?.data || err));

  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("profile-form", JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // スキル追加
  const addSkill = () => {
    setValue("skill_info", [
      ...(skills || []),
      {
        skill: "",
      },
    ])
  }

  // スキル削除
  const removeSkill = (index: number) => {
    setValue(
      "skill_info",
       skills.filter((_, i) => i !== index),
    )
  }

  // 職歴追加
  const addWorkHistory = () => {
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
  }

  // 職歴削除
  const removeWorkHistory = (index: number) => {
    setValue(
      "employment_history",
      workHistory.filter((_, i) => i !== index),
    )
  }

  // 知見追加
  const addKnowledge = () => {
    setValue("insight_info", [
      ...(knowledge || []),
      {
        insight: "",
        comment: "",
        skill: "",
      },
    ])
  }

  // 知見削除
  const removeKnowledge = (index: number) => {
    setValue(
      "insight_info",
      knowledge.filter((_, i) => i !== index),
    )
  }

  // プロジェクト追加
  const addProject = () => {
    const newProjects = [...(projects || []), {
      project: "",
      comment: "",
      skill: "",
      start_date: undefined,
      end_date: undefined,
    }]
    setValue("project_info", newProjects)
    setCurrentProjectIndex(newProjects.length - 1)
  }

  // プロジェクト削除
  const removeProject = (index: number) => {
    setValue(
      "project_info",
      projects.filter((_, i) => i !== index),
    )
    if (currentProjectIndex >= projects.length - 1) {
      setCurrentProjectIndex(Math.max(0, projects.length - 2))
    }
  }

  // セミナー動画追加
  const addSeminarVideo = () => {
    setValue("seminar_videos", [
      ...(seminarVideos || []),
      {
        seminar_videos: "",
      },
    ])
  }

  // セミナー動画削除
  const removeSeminarVideo = (index: number) => {
    setValue(
      "seminar_videos",
      seminarVideos.filter((_, i) => i !== index),
    )
  }

  const toLocalDateString = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, "0")
    const dd = date.getDate().toString().padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }


  const onSubmitEmployeeInfo = (data: FormValues) => {
    const {
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

    const filtered = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null && v !== ""));

    return api.put(`/employees/${id}`, filtered);
  };

  const onSubmitEmploymentHistory = (data: FormValues) => {
    const historyArray = data.employment_history || [];

    const formattedCompanyName = historyArray.map(h => h.company_name ?? "").join(",");
    const formattedJobTitle = historyArray.map(h => h.job_title ?? "").join(",");
    const formattedStartDate = historyArray
      .map(h => (h.start_date ? new Date(h.start_date).toISOString().split("T")[0] : null))
      .filter(d => d !== null)
      .join(",");

    const formattedEndDate = historyArray
      .map(h => (h.end_date ? new Date(h.end_date).toISOString().split("T")[0] : null))
      .filter(d => d !== null)
      .join(",");
    const formattedDescription = historyArray.map(h => h.description ?? "").join(",");
    const formattedKnowledge = historyArray
      .map(h => (h.knowledge ?? "").split(/[、,]/).join("\\"))
      .join(",");

    const payload = {
      company_name: formattedCompanyName,
      job_title: formattedJobTitle,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      description: formattedDescription,
      knowledge: formattedKnowledge,
    };

    console.log("送信データ:", payload);

    return api.put(`/employment_history/${id}`, payload);
  };


  const onSubmitProjectInfo = (data: FormValues) => {
    const projectArray = data.project_info || [];

    const formattedProject = projectArray.map(p => p.project ?? "").join(",");
    const formattedSkill = projectArray
      .map(p => (p.skill ?? "").split(/[、,]/).join("\\"))
      .join(",");
    const formattedComment = projectArray.map(p => p.comment ?? "").join(",");

    const formattedStartDate = projectArray
      .map(p => (p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : ""))
      .join(",");
    const formattedEndDate = projectArray
      .map(p => (p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : ""))
      .join(",");

    const payload = {
      project: formattedProject,
      skill: formattedSkill,
      comment: formattedComment,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    console.log("送信データ:", payload);

    return api.put(`/project_info/${id}`, payload);
  };

  const onSubmitInsightInfo = (data: FormValues) => {
    const insightArray = data.insight_info || [];

    const formattedComment = insightArray.map(i => i.comment ?? "").join(",");
    const formattedInsight = insightArray.map(i => i.insight ?? "").join(",");
    const formattedSkill = insightArray
      .map(p => (p.skill ?? "").split(/[、,]/).join("\\"))
      .join(",");

    const payload = {
      comment: formattedComment,
      skill: formattedSkill,
      insight: formattedInsight,
    };

    console.log("送信データ:", payload);

    return api.put(`/insight_info/${id}`, payload);
  };

  const onSubmitSkillInfo = (data: FormValues) => {
    const skillArray = data.skill_info || [];

    const formattedSkill = skillArray.map(s => s.skill ?? "").join(",");
    const payload = {
      skill: formattedSkill,
    };

    console.log("送信データ:", payload);

    return api.put(`/skill_info/${id}`, payload);
  };


  const onSubmitPrivateInfo = (data: FormValues) => {
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
    };

    const filtered = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null && v !== ""));

    return api.put(`/private_info/${id}`, filtered);
  };

  const onSubmitRelatedInfo = (data: FormValues) => {
    const payload = {
      profile_video: data.profile_video,
      seminarVideos: data.seminar_videos,
    };
    return api.put(`/related_info/${id}`, payload);
  };

  const goTOView = (id: number) => {
    router.push(`/${id}/`);
  }

  const goTOList = () => {
    router.push("../")
  }

  // フォーム送信
  const onSubmit = async (data: FormValues) => {
    try {
      await Promise.all([
        onSubmitEmployeeInfo(data),
        onSubmitEmploymentHistory(data),
        onSubmitProjectInfo(data),
        onSubmitInsightInfo(data),
        onSubmitSkillInfo(data),
        onSubmitPrivateInfo(data),
        onSubmitRelatedInfo(data),
      ]);
      alert("すべてのセクションが正常に保存されました");
      goTOList()
    } catch (error) {
      console.error("保存に失敗しました:", error);
      alert("保存中にエラーが発生しました");
    }
  };


  // 次のタブに移動
  const handleNextTabClick = (e: React.MouseEvent) => {
    e.preventDefault() // submit を防ぐ
    goToNextTab()
  }

  const goToNextTab = () => {
    if (activeTab === "basic") setActiveTab("professional")
    else if (activeTab === "professional") setActiveTab("personal")
    else if (activeTab === "personal") setActiveTab("media")
  }

  // 前のタブに移動
  const goToPrevTab = () => {
    if (activeTab === "media") setActiveTab("personal")
    else if (activeTab === "personal") setActiveTab("professional")
    else if (activeTab === "professional") setActiveTab("basic")
  }

  // 編集の修了
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 pt-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">プロフィール登録</h1>
        <div className = "flex gap-10 py-8 justify-end mr-4">
          <div className="text-sm text-right p-0 m-0 md:text-base">
            {employees && (
              <button
                className="bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none"
                onClick={() => goTOView(employees.id)}
              >
                閲覧画面に戻る
              </button>
            )}
          </div>
          <div className="text-sm text-right p-0 m-0 md:text-base">
            <button className = "bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none" onClick = {goTOList}>一覧に戻る</button>
          </div>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-md">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 p-1 w-full">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">基本情報</span>
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="hidden sm:inline">業務情報</span>
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">プライベート情報</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    <span className="hidden sm:inline">関連情報</span>
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[70vh] px-6 py-4">
                  {/* 基本情報タブ */}
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">プロフィール写真</h2>
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-slate-400" />
                        </div>
                        <Button type="button" variant="outline">
                          写真をアップロード
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">基本情報</h2>
                      <div className="grid grid-cols-1 gap-4 px-1">
                        <FormField
                          control={form.control}
                          name="employee_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>社員番号</FormLabel>
                              <FormControl>{employees && <Input {...field} value={employees.employee_id} readOnly />}</FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>氏名</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input placeholder={employees?.name ?? "氏名を入力"} {...field} value={field.value ?? ""} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="kana"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>フリガナ</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input placeholder={employees?.kana ?? "フリガナを記入"} {...field} value={field.value ?? ""} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="birthdate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col px-1">
                              <FormLabel>生年月日</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full pl-3 text-left font-normal ${
                                        !field.value ? "text-muted-foreground" : ""
                                      }`}
                                    >
                                      {field.value
                                        ? format(field.value, "yyyy-MM-dd", { locale: ja })
                                        : employees?.birthdate
                                          ? format(employees.birthdate, "yyyy-MM-dd", { locale: ja })
                                          : "誕生日を入力  /  記入例 : yyyy-MM-dd"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value ?? undefined}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                    classNames={{
                                      caption_label: "hidden",
                                      caption_dropdowns: "flex gap-2 justify-center",
                                      dropdown: "border px-2 py-1 rounded-md text-sm",
                                      dropdown_year: "bg-white",
                                      dropdown_month: "bg-white",
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hometown"
                          render={({ field }) => (
                            <FormItem className="px-1">
                              <FormLabel>出身地</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.hometown ?? "出身地を入力"}
                                    {...field}
                                    value={field.value ?? ""}
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">学歴</h2>
                      <FormField
                        control={form.control}
                        name="elementary_school"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>小学校</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.elementary_school ?? "小学校名を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="junior_high_school"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>中学校</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.junior_high_school ?? "中学校名を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="high_school"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>高校</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.high_school ?? "高校名を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="university"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>大学</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.university ?? "大学名を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="faculty"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>学部学科</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.faculty ?? "大学における所属学部及び学科を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="graduate_school"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>大学院</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input
                                  placeholder={employees?.graduate_school ?? "大学院名を入力"}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="major"
                        render={({ field }) => (
                          <FormItem className="px-1">
                            <FormLabel>専攻</FormLabel>
                            <FormControl>
                              {employees && (
                                <Input placeholder={employees?.major ?? "大学院における専攻を入力"} {...field} value={field.value ?? ""} />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">職歴</h2>
                      <div className="space-y-6">
                        {(workHistory ?? []).map((work, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => removeWorkHistory(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`employment_history.${index}.company_name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>会社名</FormLabel>
                                    <FormControl>
                                      <Input placeholder="会社名を入力  /  記入例 : 株式会社〇〇" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`employment_history.${index}.start_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>開始日</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="開始日を入力  /  記入例 : 20XX-0X-0X"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`employment_history.${index}.end_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>終了日</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="終了日を入力  /  記入例 : 20XX-0X-0X"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`employment_history.${index}.job_title`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>職種</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="職種名を入力  /  記入例 : バックエンドエンジニア"
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`employment_history.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>業務内容</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="業務内容を入力  /  記入例 : 社内システムの作成"
                                      {...field}
                                      rows={3}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`employment_history.${index}.knowledge`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>獲得した知見</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="獲得知見のタイトルを入力  /  記入例 : データベース接続"
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button type="button" variant="outline" className="w-full" onClick={addWorkHistory}>
                          <Plus className="mr-2 h-4 w-4" /> 職歴を追加
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 業務情報タブ */}
                  <TabsContent value="professional" className="space-y-6 mt-0">
                    <div>
                      <div className="space-y-4" >
                        <h2 className="text-xl font-semibold">スキル</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(skills?? []).map((item, index) => (
                            <div key={index} >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1"
                                onClick={() => removeSkill(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <FormField
                                control={form.control}
                                name={`skill_info.${index}.skill`}
                                render={({ field }) => (
                                  <FormItem className="mb-4">
                                    <FormLabel>タイトル</FormLabel>
                                    <FormControl>
                                      <Input placeholder="スキル名を入力  /  記入例 : React" {...field} value={field.value ?? ""} className = "placeholder:text-[11px]"/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <Button type="button" onClick={addSkill}>
                          追加
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">知見</h2>
                      <div className="space-y-4">
                        {(knowledge?? []).map((item, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => removeKnowledge(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <FormField
                              control={form.control}
                              name={`insight_info.${index}.insight`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>タイトル</FormLabel>
                                  <FormControl>
                                    <Input placeholder="獲得知見のタイトルを入力  /  記入例 : データベース接続" {...field} value={field.value ?? ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`insight_info.${index}.comment`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>補足</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="獲得知見に関する補足的情報を入力"
                                      {...field}
                                      rows={3}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`insight_info.${index}.skill`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>関連スキル</FormLabel>
                                  <FormControl>
                                    <Input placeholder="獲得スキルを入力 <カンマ区切り> / 記入例:スキル1,スキル2" {...field} value={field.value ?? ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button type="button" variant="outline" className="w-full" onClick={addKnowledge}>
                          <Plus className="mr-2 h-4 w-4" /> 知見を追加
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">参画プロジェクト</h2>
                      <div className="space-y-4">
                        {(projects ?? []).map((_, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => removeProject(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`project_info.${index}.project`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>プロジェクト名</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="プロジェクト名を入力 /  記入例 : 人材管理システムリニューアル"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`project_info.${index}.start_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>開始日</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="開始日を入力  /  記入例 : 20XX-0X-0X"
                                        {...field}
                                        value={field.value ?? ""}

                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`project_info.${index}.end_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>終了日</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="終了日を入力  /  記入例 : 20XX-0X-0X"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                            </div>

                            <FormField
                              control={form.control}
                              name={`project_info.${index}.comment`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>補足</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="プロジェクトに関する補足的情報を記入"
                                      {...field}
                                      rows={3}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`project_info.${index}.skill`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>獲得スキル</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="獲得スキルを記入 <カンマ区切り>  /  記入例 : スキル1,スキル2"
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button type="button" variant="outline" className="w-full" onClick={addProject}>
                          <Plus className="mr-2 h-4 w-4" /> プロジェクトを追加
                        </Button>
                      </div>
                    </div>

                  </TabsContent>

                  {/* プライベート情報タブ */}
                  <TabsContent value="personal" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">家族・背景</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="family_structure"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>家族構成</FormLabel>
                              <FormControl>
                                {privateInfo && (
                                  <Input placeholder={privateInfo?.family_structure ?? "家族構成を入力  /  記入例 : 父・母・本人"} {...field} value={field.value ?? ""} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="father_job"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>父親の職業</FormLabel>
                                <FormControl>
                                  {privateInfo && (
                                    <Input placeholder={privateInfo?.father_job ?? "職業名を入力"} {...field} value={field.value ?? ""} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mother_job"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>母親の職業</FormLabel>
                                <FormControl>
                                  {privateInfo && (
                                    <Input placeholder={privateInfo?.mother_job ?? "職業名を入力"} {...field} value={field.value ?? ""} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="blood_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>血液型</FormLabel>
                                <FormControl>
                                  {privateInfo && (
                                    <Input placeholder={privateInfo?.blood_type ?? "血液型を入力  /  記入例 : O型"} {...field} value={field.value ?? ""} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ニックネーム</FormLabel>
                                <FormControl>
                                  {privateInfo && (
                                    <Input placeholder={privateInfo?.nickname ?? "ニックネームを入力"} {...field} value={field.value ?? ""} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="mbti"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>MBTI（性格タイプ）</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Input placeholder={privateInfo?.mbti ?? "MBTIを入力  /  記入例 : ISTJ"} {...field} value={field.value ?? ""} />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">活動歴</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="lessons"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>習い事</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.lessons ?? "習い事を入力  /  記入例 : 水泳 (2歳～10歳)・ピアノ (5歳～10歳)"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="club_activities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>部活</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.club_activities ?? "部活を入力  /  記入例 : サッカー部 (中学) ・ テニス部 (高校)"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jobs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>アルバイト</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.jobs ?? "アルバイト経験を入力  /  記入例 : カフェ店員 (大学1年時) ・ レストランスタッフ (大学2年時)"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="circles"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>サークル</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.lessons ?? "習い事を記入  /  記入例 : 水泳 (2歳～10歳)・ピアノ (5歳～10歳)"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">趣味・好み</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="hobbies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>趣味</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.hobbies ?? "趣味を入力  /  記入例 : テニス ・ カラオケ"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favorite_foods"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きな食べ物</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.favorite_foods ?? "好きな食べ物を入力  /  記入例 : 焼肉 ・ ラーメン"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="disliked_foods"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>苦手な食べ物</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.disliked_foods ?? "嫌いな食べ物を入力  /  記入例 : ゴーヤ ・ ピーマン"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="holiday_activities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>休日の過ごし方</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.holiday_activities ?? "休日の過ごし方を入力  /  記入例 : 友達と外食 ・ 一人カラオケ"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favorite_celebrities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きな芸能人</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.favorite_celebrities ?? "好きな芸能人を入力  /  記入例 : 佐藤健 ・ 新垣結衣 ・ 星野源"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favorite_characters"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きなキャラクター</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.favorite_characters ?? "好きなキャラクターを入力  /  記入例 : ドラえもん ・ スヌーピー"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favorite_artists"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きなアーティスト</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.favorite_artists ?? "好きなアーティストを入力  /  記入例 : Official髭男dism ・ あいみょん"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favorite_comedians"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きな芸人</FormLabel>
                              <FormControl>
                                  {privateInfo && (
                                    <Textarea
                                      placeholder={privateInfo?.favorite_comedians ?? "好きな芸人を入力  /  記入例 : サンドウィッチマン ・ 千鳥"}
                                      {...field}
                                      rows={2}
                                      value={field.value ?? ""}
                                    />
                                  )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* 関連情報タブ */}
                  <TabsContent value="media" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">プロフィール動画</h2>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center p-6">
                            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                            <p className="text-slate-500">動画をアップロード</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="profile_video"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>動画URL</FormLabel>
                              <FormControl>
                                <Input placeholder="動画URLを入力  /  記入例 : https://example.com/video" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">セミナー動画</h2>
                      <div className="space-y-4">
                        {(seminarVideos ?? []).map((video, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => removeSeminarVideo(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center p-6">
                                  <Upload className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                                  <p className="text-slate-500">動画をアップロード</p>
                                </div>
                              </div>
                              <FormField
                                control={form.control}
                                name={`seminar_videos.${index}.seminar_videos`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>動画URL</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://example.com/video"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" className="w-full" onClick={addSeminarVideo}>
                          <Plus className="mr-2 h-4 w-4" /> セミナー動画を追加
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between p-6 border-t">
              <Button type="button" variant="outline" onClick={goToPrevTab} disabled={activeTab === "basic"}>
                <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
              </Button>

              {activeTab !== "media" ? (
                <Button type="button" onClick={handleNextTabClick}>
                  次へ <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> 保存
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default ProfileForm
