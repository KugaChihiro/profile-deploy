"use client"

import { useState, useEffect, FC} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format,parseISO } from "date-fns"
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
import { EmployeeOut,EmployeeUpdate } from "@/types/employee";
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
const formSchema = z.object({
  // 基本情報
  employee_id:z.number().optional().nullable(),
  name: z.string().optional().nullable(),
  kana: z.string().optional().nullable(),
  birthdate: z.date().optional().nullable(),
  hometown: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),

  // 学歴
  elementary_school: z.string().optional().nullable(),
  junior_high_school: z.string().optional().nullable(),
  high_school: z.string().optional().nullable(),
  university: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  graduate_school: z.string().optional().nullable(),
  major: z.string().optional().nullable(),


  // 職歴
  workHistory: z
    .array(
      z.object({
        companyName: z.string(),
        period: z.string(),
        position: z.string(),
        description: z.string(),
        achievements: z.string(),
      }),
    )
    .default([]),

  // 業務情報
  skills: z.array(z.string()).default([]),
  knowledge: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        period: z.string(),
        description: z.string(),
        technologies: z.array(z.string()).default([]),
      }),
    )
    .default([]),

  // プライベート情報
  familyStructure: z.string(),
  parentsOccupation: z.string(),
  lessons: z.string(),
  clubs: z.string(),
  partTimeJobs: z.string(),
  circles: z.string(),
  hobbies: z.string(),
  favoriteFoods: z.string(),
  holidays: z.string(),
  favoriteCelebrities: z.string(),

  // 関連情報
  profileVideo: z.string().optional(),
  seminarVideos: z
    .array(
      z.object({
        title: z.string(),
        date: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  id: number;
};

const ProfileForm: FC<Props> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("basic")
  const [newSkill, setNewSkill] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [employees, setEmployees] = useState<EmployeeOut | null>(null)


  // フォームの初期化
  const saved = typeof window !== "undefined" ? localStorage.getItem("profile-form") : null;
  const values: FormValues = saved
    ? JSON.parse(saved)
    : {
        // 基本情報
        employee_id: undefined,
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
        // 職歴
        workHistory: [],
        skills: [],
        knowledge: [],
        projects: [],
        familyStructure: "",
        parentsOccupation: "",
        lessons: "",
        clubs: "",
        partTimeJobs: "",
        circles: "",
        hobbies: "",
        favoriteFoods: "",
        holidays: "",
        favoriteCelebrities: "",
        seminarVideos: [],
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:values,
  })


  // フォームの値を取得
  const { watch, setValue } = form
  const skills = watch("skills")
  const projects = watch("projects")
  const workHistory = watch("workHistory")
  const knowledge = watch("knowledge")
  const seminarVideos = watch("seminarVideos")

  useEffect(() => {
    api.get(`/employees/${id}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("profile-form", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // スキル追加
  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setValue("skills", [...skills, newSkill])
      setNewSkill("")
    }
  }

  // スキル削除
  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
    )
  }

  // 職歴追加
  const addWorkHistory = () => {
    setValue("workHistory", [
      ...workHistory,
      {
        companyName: "",
        period: "",
        position: "",
        description: "",
        achievements: "",
      },
    ])
  }

  // 職歴削除
  const removeWorkHistory = (index: number) => {
    setValue(
      "workHistory",
      workHistory.filter((_, i) => i !== index),
    )
  }

  // 知見追加
  const addKnowledge = () => {
    setValue("knowledge", [
      ...knowledge,
      {
        title: "",
        description: "",
      },
    ])
  }

  // 知見削除
  const removeKnowledge = (index: number) => {
    setValue(
      "knowledge",
      knowledge.filter((_, i) => i !== index),
    )
  }

  // プロジェクト追加
  const addProject = () => {
    setValue("projects", [
      ...projects,
      {
        name: "",
        period: "",
        description: "",
        technologies: [],
      },
    ])
    setCurrentProjectIndex(projects.length)
  }

  // プロジェクト削除
  const removeProject = (index: number) => {
    setValue(
      "projects",
      projects.filter((_, i) => i !== index),
    )
    if (currentProjectIndex >= projects.length - 1) {
      setCurrentProjectIndex(Math.max(0, projects.length - 2))
    }
  }

  // 技術スタック追加
  const addTechnology = () => {
    if (projects.length === 0) return

    if (newTechnology.trim() !== "" && !projects[currentProjectIndex].technologies.includes(newTechnology)) {
      const updatedProjects = [...projects]
      updatedProjects[currentProjectIndex].technologies = [
        ...updatedProjects[currentProjectIndex].technologies,
        newTechnology,
      ]
      setValue("projects", updatedProjects)
      setNewTechnology("")
    }
  }

  // 技術スタック削除
  const removeTechnology = (tech: string) => {
    if (projects.length === 0) return

    const updatedProjects = [...projects]
    updatedProjects[currentProjectIndex].technologies = updatedProjects[currentProjectIndex].technologies.filter(
      (t) => t !== tech,
    )
    setValue("projects", updatedProjects)
  }

  // セミナー動画追加
  const addSeminarVideo = () => {
    setValue("seminarVideos", [
      ...seminarVideos,
      {
        title: "",
        date: "",
        url: "",
      },
    ])
  }

  // セミナー動画削除
  const removeSeminarVideo = (index: number) => {
    setValue(
      "seminarVideos",
      seminarVideos.filter((_, i) => i !== index),
    )
  }

  // フォーム送信
  const onSubmit = (data: FormValues) => {
    alert("プロフィール情報が保存されました")
    const { employee_id, birthdate, ...rest } = data;
    const employees_update: EmployeeUpdate = {
      ...rest,
      birthdate: birthdate ? birthdate.toISOString().split("T")[0] : undefined,
    };
    const filteredData: EmployeeUpdate = Object.fromEntries(
      Object.entries(employees_update).filter(([_, value]) => value != null && value !== "")
    );
    console.log(filteredData);
    api.put(`/employees/${id}`, filteredData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log("更新成功:", res.data);
      })
      .catch((err) => {
        console.error("更新失敗:", err);
      });
    localStorage.clear();
    router.replace("../")
  }


  // 次のタブに移動
  const handleNextTabClick = (e: React.MouseEvent) => {
    e.preventDefault(); // submit を防ぐ
    goToNextTab();
  };

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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">プロフィール登録</h1>

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
                              <FormControl>
                                {employees && (
                                  <Input
                                    {...field}
                                    value={`${id}`}
                                    readOnly/>
                                )}
                              </FormControl>
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
                                  <Input
                                    placeholder={employees?.name ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
                                />
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
                                  <Input
                                    placeholder={employees?.kana ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
                                />
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
                                      {field.value ? (
                                        format(field.value, "yyyy年MM月dd日", { locale: ja })
                                      ) : employees?.birthdate ? (
                                        format(employees.birthdate, "yyyy年MM月dd日", { locale: ja })
                                      ) : (
                                        "None"
                                      )}
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
                            <FormItem className = "px-1">
                              <FormLabel>出身地</FormLabel>
                              <FormControl>
                                {employees && (
                                    <Input
                                      placeholder={employees?.hometown ?? "None"}
                                      {...field}
                                      value={field.value ?? ''}
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
                            <FormItem  className = "px-1">
                              <FormLabel>小学校</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.elementary_school ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>中学校</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.junior_high_school ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>高校</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.high_school ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>大学</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.university ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>学部学科</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.faculty ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>大学院</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.graduate_school ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
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
                            <FormItem className = "px-1">
                              <FormLabel>専攻</FormLabel>
                              <FormControl>
                                {employees && (
                                  <Input
                                    placeholder={employees?.major ?? "None"}
                                    {...field}
                                    value={field.value ?? ''}
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">職歴</h2>
                      <div className="space-y-6">
                        {workHistory.map((work, index) => (
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
                                name={`workHistory.${index}.companyName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>会社名</FormLabel>
                                    <FormControl>
                                      <Input placeholder="株式会社〇〇" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`workHistory.${index}.period`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>期間</FormLabel>
                                    <FormControl>
                                      <Input placeholder="2018年4月 - 2021年3月" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`workHistory.${index}.position`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>役職・ポジション</FormLabel>
                                  <FormControl>
                                    <Input placeholder="フロントエンドエンジニア" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`workHistory.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>業務内容</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="担当した業務内容を記入してください" {...field} rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`workHistory.${index}.achievements`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>獲得した知見・強み</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="この職場で得た知見や強みを記入してください"
                                      {...field}
                                      rows={3}
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
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">獲得スキル</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill, index) => (
                          <Badge key={index} className="bg-blue-500 pl-2 pr-1 py-1 flex items-center gap-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="新しいスキルを入力"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill}>
                          追加
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">獲得知見</h2>
                      <div className="space-y-4">
                        {knowledge.map((item, index) => (
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
                              name={`knowledge.${index}.title`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>タイトル</FormLabel>
                                  <FormControl>
                                    <Input placeholder="フロントエンド開発" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`knowledge.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>説明</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="獲得した知見の詳細を記入してください" {...field} rows={3} />
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

                      {projects.length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentProjectIndex(Math.max(0, currentProjectIndex - 1))}
                            disabled={currentProjectIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> 前へ
                          </Button>
                          <span>
                            プロジェクト {currentProjectIndex + 1} / {projects.length}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentProjectIndex(Math.min(projects.length - 1, currentProjectIndex + 1))
                            }
                            disabled={currentProjectIndex === projects.length - 1}
                          >
                            次へ <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}

                      {projects.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-lg relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeProject(currentProjectIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormField
                              control={form.control}
                              name={`projects.${currentProjectIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>プロジェクト名</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ECサイトリニューアル" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`projects.${currentProjectIndex}.period`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>期間</FormLabel>
                                  <FormControl>
                                    <Input placeholder="2019-2020" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`projects.${currentProjectIndex}.description`}
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel>プロジェクト概要</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="プロジェクトの概要を記入してください" {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormItem>
                            <FormLabel>使用技術</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {projects[currentProjectIndex].technologies.map((tech, techIndex) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                                >
                                  {tech}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1"
                                    onClick={() => removeTechnology(tech)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="React, TypeScript など"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    addTechnology()
                                  }
                                }}
                              />
                              <Button type="button" onClick={addTechnology}>
                                追加
                              </Button>
                            </div>
                          </FormItem>
                        </div>
                      )}

                      <Button type="button" variant="outline" className="w-full" onClick={addProject}>
                        <Plus className="mr-2 h-4 w-4" /> プロジェクトを追加
                      </Button>
                    </div>
                  </TabsContent>

                  {/* プライベート情報タブ */}
                  <TabsContent value="personal" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">家族・背景</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="familyStructure"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>家族構成</FormLabel>
                              <FormControl>
                                <Textarea placeholder="父、母、姉、本人" {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parentsOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>親の職業</FormLabel>
                              <FormControl>
                                <Textarea placeholder="父：会社員（エンジニア）、母：小学校教師" {...field} rows={2} />
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
                                <Textarea placeholder="ピアノ（6歳〜15歳）、英会話（10歳〜18歳）" {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clubs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>部活</FormLabel>
                              <FormControl>
                                <Textarea placeholder="中学：サッカー部、高校：コンピュータ部" {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="partTimeJobs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>アルバイト</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="カフェスタッフ（大学1年〜3年）、プログラミング講師（大学3年〜4年）"
                                  {...field}
                                  rows={2}
                                />
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
                                <Textarea placeholder="プログラミングサークル、軽音楽サークル" {...field} rows={2} />
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
                                <Textarea
                                  placeholder="ギター演奏、登山、プログラミング（個人開発）"
                                  {...field}
                                  rows={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favoriteFoods"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きな食べ物</FormLabel>
                              <FormControl>
                                <Textarea placeholder="ラーメン、イタリアン、和菓子" {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="holidays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>休日の過ごし方</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="カフェでプログラミング、友人とのアウトドア活動、技術書を読む"
                                  {...field}
                                  rows={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="favoriteCelebrities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>好きな芸能人</FormLabel>
                              <FormControl>
                                <Textarea placeholder="佐藤健、新垣結衣、星野源" {...field} rows={2} />
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
                        <Button type="button" variant="outline" className="w-full">
                          プロフィール動画をアップロード
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">セミナー動画</h2>
                      <div className="space-y-4">
                        {seminarVideos.map((video, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => removeSeminarVideo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`seminarVideos.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>タイトル</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Webフロントエンド最新動向" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`seminarVideos.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>日付</FormLabel>
                                    <FormControl>
                                      <Input placeholder="2023年5月" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`seminarVideos.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>動画URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/video" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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

export default ProfileForm;