"use client"

import { useState, useEffect, FC} from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EmployeeOut } from "@/types/employee";
import { EmploymentHistoryOut} from "@/types/employment_history";
import { ProjectInfoOut } from "@/types/project_info";
import { InsightInfoOut } from "@/types/insight_info";
import { SkillInfoOut } from "@/types/skill_info";
import { PrivateInfoOut } from "@/types/private_info";
import { RelatedInfoOut } from "@/types/related_info";
import {
  User,
  Briefcase,
  Heart,
  Film,
  GraduationCap,
  MapPin,
  Calendar,
  Code,
  Lightbulb,
  FolderKanban,
  Users,
  Building,
  Music,
  Dumbbell,
  Coffee,
  CircleUser,
  Pizza,
  Palmtree,
  Tv,
  Mic,
  Smile,
  ToyBrick,
  Droplet,
  Tag,
  Puzzle,
  Carrot,
  LinkIcon,
  Loader2,
  History
} from "lucide-react"


type Props = {
  id: number;
};


const ProfilePage: FC<Props> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("basic")
  const [employees, setEmployees] = useState<EmployeeOut | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryOut | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoOut | null>(null);
  const [insightInfo, setInsightInfo] = useState<InsightInfoOut | null>(null);
  const [skillInfo, setSkillInfo] = useState<SkillInfoOut | null>(null);
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoOut | null>(null);
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  const goTOEdition = (id: number) => {
    router.push(`/${id}/edit`);
  }

  const goTOList = () => {
    router.push("../")
  }

  type EmploymentHistoryUnit = {
    company_name: string | null;
    job_title?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
    knowledge?: string | null;
  };

  const parseEmploymentHistory = (): EmploymentHistoryUnit[] => {
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

  type ProjectUnit = {
    project: string | null;
    skill?: string | null;
    comment?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };

  const parseProjectInfo = (): ProjectUnit[] => {
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

  type InsightUnit = {
    insight: string | null;
    skill?: string | null;
    comment?: string | null;
  };

  const parseInsightInfo = (): InsightUnit[] => {
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


  type SkillUnit = {
    skill: string | null;
  };

  const parseSkillInfo = (): SkillUnit[] => {
    const skills = skillInfo && (skillInfo.skill?.split(",") ?? []);

    if (!skills || skills.length === 0) return [];

    return skills.map((skill) => ({
      skill: skill?.trim() || null,
    }));
  };

  type VideoUnit = {
    video_url: string | undefined;
    thumbnail_url:string | undefined;
  };

  const parseSeminarInfo = (): VideoUnit[] => {
    const video_url = relatedInfo && (relatedInfo.seminar_videos?.split(",") ?? []);
    const thumbnail_url = relatedInfo && (relatedInfo.seminar_thumbnail_url?.split(",") ?? []);

    if (!video_url || video_url.length === 0) return [];

    return video_url.map((video_url, index) => ({
      video_url: video_url?.trim() || undefined,
      thumbnail_url : thumbnail_url?.[index]?.trim() || undefined,
    }));
  };

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
          resRelated
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
      } catch (err: any) {
        console.error("データ取得に失敗:", err.response?.data || err);
      } finally {
        setIsLoading(false); // 全て終わったら解除
      }
    };

    fetchAll();
  }, []);

  const  ProfileVideoClick = (url: string) => {
    window.open(url, "_blank");
  }

  const  SeminarVideoClick = (url: string) => {
    window.open(url, "_blank");
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Card className="shadow-lg border-none">
        <CardContent className="p-0">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r bg-gray-100 rounded-t-lg flex justify-center items-center via-gray-300 to-gray-100"><img src = "/logo.png" className = "w-3/5 rounded-t-lg"/></div>
            <div className="absolute -bottom-16 flex justify-between items-center w-full max-w-5xl pl-10">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                {employees && (<AvatarImage src={employees.photo_url ?? "/placeholder.svg"} alt="プロフィール写真" />)}
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="flex gap-2 mr-10 md:gap-10">
                <div className="text-sm text-right pt-20 px-0 m-0 md:text-base">
                  {employees && (
                    <button
                      className="bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none"
                      onClick={() => goTOEdition(employees.id)}
                    >
                      編集する
                    </button>
                  )}
                </div>
                <div className="text-sm text-right pt-20 px-0 m-0 md:text-base">
                  <button className = "bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none" onClick = {goTOList}>一覧に戻る</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
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

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">氏名</p>
                          {employees && (<p className="font-medium">{employees.name}</p>)}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">フリガナ</p>
                          {employees && (<p className="font-medium">{employees.kana}</p>)}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">生年月日</p>
                          {employees && (<p className="font-medium">{employees.birthdate}</p>)}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">出身地</p>
                          {employees && (<p className="font-medium">{employees.hometown}</p>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">学歴</h2>
                    <div className="space-y-4">
                      {/* 小学校 */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">小学校</p>
                          {employees && <p className="font-medium">{employees.elementary_school}</p>}
                        </div>
                      </div>

                      {/* 中学校 */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">中学校</p>
                          {employees && <p className="font-medium">{employees.junior_high_school}</p>}
                        </div>
                      </div>

                      {/* 高等学校 */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">高等学校</p>
                          {employees && <p className="font-medium">{employees.high_school}</p>}
                        </div>
                      </div>

                      {/* 大学 */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">大学</p>
                          {employees && (
                            <p className="font-medium">
                              {employees.university} {employees.faculty}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 大学院 */}
                      {employees && employees.graduate_school && (
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">大学院</p>
                            <p className="font-medium">
                              {employees.graduate_school} {employees.major}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                <div>
                  <h2 className="text-2xl font-bold mb-4 mt-10">職歴</h2>
                  <div className="space-y-6">
                    {parseEmploymentHistory().map((employmentHistory, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{employmentHistory.company_name?? 'なし'}</h3>
                          <p className="text-sm text-slate-500">
                            {employmentHistory.start_date ?? '開始不明'} - {employmentHistory.end_date ?? '終了不明'}
                          </p>
                        </div>
                        <p className="text-slate-700 mb-3">{employmentHistory.job_title ?? '職種不明'}</p>

                        {employmentHistory.description && (
                          <>
                            <p className="text-sm text-slate-600 mb-2">業務内容:</p>
                            <ul className="list-disc list-inside text-sm text-slate-600 mb-3 ml-2">
                              {employmentHistory.description.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        {employmentHistory.knowledge && (
                          <>
                            <p className="text-sm text-slate-600 mb-2">獲得した知見・強み:</p>
                            <ul className="list-disc list-inside text-sm text-slate-600 ml-2">
                              {employmentHistory.knowledge.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    獲得スキル
                  </h2>
                  <div className = "flex gap-5 flex-wrap">
                    {parseSkillInfo().map((skillInfo, idx) => (
                      <div className="flex flex-wrap gap-2 mb-6"  key={idx} >
                        <Badge className="bg-blue-500">{skillInfo.skill ?? "None"}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6" />
                    獲得知見
                  </h2>
                  {parseInsightInfo().map((insightInfo, idx) => (
                    <div className="grid grid-cols-1 gap-4" key = {idx}>
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{insightInfo.insight ?? "不明"}</h3>
                          {insightInfo && insightInfo.comment && (
                          <p className="text-sm text-slate-600">
                            {insightInfo.comment.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                          </p>)}
                          {insightInfo.skill && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {insightInfo.skill.split('\\').map((skill, skillIndex) => (
                                <Badge variant="outline" className="text-xs" key={skillIndex}>{skill.trim()  ?? "None"}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FolderKanban className="h-6 w-6" />
                    参画プロジェクト
                  </h2>
                  {parseProjectInfo().map((projectInfo, idx) => (
                    <div className="space-y-4  gap-3" key = {idx}>
                      <Card className="border-slate-200" >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{projectInfo.project ?? "不明"}</h3>
                            <Badge>{projectInfo.start_date ?? "不明"} - {projectInfo.end_date ?? "不明"}</Badge>
                          </div>
                          {projectInfo && projectInfo.comment && (
                            <p className="text-sm text-slate-600 mb-2">
                              {projectInfo.comment.split('\n').map((line, i) => (
                                  <li key={i}>{line}</li>
                                ))}
                            </p>
                          )}
                          {projectInfo.skill && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {projectInfo.skill.split('\\').map((skill, skillIndex) => (
                                <Badge variant="outline" className="text-xs" key={skillIndex}>{skill.trim()  ?? "None"}</Badge>
                              ))}
                            </div>
                          )}

                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <User className="h-6 w-6" />
                       個人
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">ニックネーム</p>
                          <p className="font-medium">{privateInfo?.nickname}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Droplet className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">血液型</p>
                          <p className="font-medium">{privateInfo?.blood_type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Puzzle className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">MBTI</p>
                          <p className="font-medium">{privateInfo?.mbti}</p>
                        </div>
                      </div>

                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      家族・背景
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">家族構成</p>
                          <p className="font-medium">{privateInfo?.family_structure}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">親の職業</p>
                          {privateInfo?.father_job && (<p className="font-medium">父：{privateInfo?.father_job}</p>)}
                          {privateInfo?.mother_job && (<p className="font-medium">母：{privateInfo?.mother_job}</p>)}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                      <History className="h-6 w-6" />
                      活動歴
                    </h2>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Music className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">習い事</p>
                                {privateInfo?.lessons
                                  ?.split(/[,\/\\・\-、]/)
                                  .map((item, index) => (
                                    <p className="font-medium" key={index}>{item.trim()}</p>
                                  ))}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Dumbbell className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">部活</p>
                                {privateInfo?.club_activities?.split(/[,\/\\・\-、]/).map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                                ))}
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Coffee className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">アルバイト</p>
                                {privateInfo?.jobs?.split(/[,\/\\・\-、]/).map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                                ))}
                            </div>
                          </div>
                        <div className="flex items-start gap-3">
                          <CircleUser className="h-5 w-5 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">サークル</p>
                              {privateInfo?.circles?.split(/[,\/\\・\-、]/).map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                              ))}
                          </div>
                        </div>
                        {privateInfo?.activities_free && (
                          <div className="flex items-start gap-3">
                            <History className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">その他の活動(自由記述)</p>
                              <p className="font-medium">{privateInfo?.activities_free}</p>
                            </div>
                          </div>
                        )}
                      </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Heart className="h-6 w-6" />
                      趣味・好み
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">趣味</p>
                          {privateInfo?.hobbies?.split(/[,\/\\・\-、]/).map((item, index) => (
                            <p className="font-medium" key={index}>{item.trim()}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Pizza className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな食べ物</p>
                            {privateInfo?.favorite_foods?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Carrot className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">嫌いな食べ物</p>
                          {privateInfo?.disliked_foods?.split(/[,\/\\・\-、]/).map((item, index) => (
                            <p className="font-medium" key={index}>{item.trim()}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Palmtree className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">休日の過ごし方</p>
                            {privateInfo?.holiday_activities?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Tv className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな芸能人</p>
                            {privateInfo?.favorite_celebrities?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ToyBrick className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなキャラクター</p>
                            {privateInfo?.favorite_characters?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mic className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなアーティスト</p>
                            {privateInfo?.favorite_artists?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Smile className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなお笑い芸人</p>
                            {privateInfo?.favorite_comedians?.split(/[,\/\\・\-、]/).map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      {privateInfo?.favorite_things_free && (
                        <div className="flex items-start gap-3">
                          <Heart className="h-5 w-5 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">その他の好きなもの・こと（自由記述）</p>
                            <p className="font-medium">{privateInfo?.favorite_things_free}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">プロフィール動画</h2>
                  {relatedInfo?.profile_video? (
                    <>
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer" onClick={() => ProfileVideoClick(relatedInfo?.profile_video ?? "")}>
                        <video
                          className="w-full h-full object-cover"
                          controls
                          src={relatedInfo?.profile_video  || undefined}
                          poster={relatedInfo?.profile_thumbnail_url || undefined}
                        >
                        </video>
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300  pointer-events-none flex items-center justify-center">
                            <p className="text-white text-sm sm:text-base px-4 text-center pointer-events-none">
                              動画が表示されない場合はここをクリック
                            </p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-100 rounded-md border-gray-300 text-gray-700 break-all select-text cursor-text flex gap-2">
                        <LinkIcon/>
                        <a
                          href={relatedInfo?.profile_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-gray-300"
                        >
                          {relatedInfo?.profile_video}
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Film className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">プロフィール動画がここに表示されます</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">セミナー動画</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parseSeminarInfo().map((item, index) => (
                      <div className = "flex flex-col"  key={index}>
                        {item ? (
                          <div className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer" onClick={() => SeminarVideoClick(item.video_url ?? "")}>
                            <video
                              className="w-full h-full object-cover"
                              controls
                              src={item.video_url  || undefined}
                              poster={item?.thumbnail_url || undefined}
                            >
                            </video>
                            <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300  pointer-events-none flex items-center justify-center">
                                <p className="text-white text-sm sm:text-base px-4 text-center pointer-events-none">
                                  動画が表示されない場合はここをクリック
                                </p>
                            </div>
                          </div>
                        ):(
                          <div className="w-full h-full object-cover aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                            <div className="text-center p-6">
                              <Film className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                              <p className="text-slate-500">セミナー動画がここに表示されます</p>
                            </div>
                          </div>
                        )}

                        {item ? (
                          <div className="mt-4 p-3 bg-gray-100 rounded-md border-gray-300 text-gray-700 break-all select-text cursor-text flex gap-2 items-center">
                            <LinkIcon/>
                            <a
                              href={item.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:text-gray-300"
                            >
                              {item.video_url}
                            </a>
                          </div>
                          ) : (
                            <span className="text-s"/>
                          )
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      {isLoading && (<div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 shadow-lg rounded-lg border z-50">
        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
        <span className="text-sm">データ取得中…<br/>少々お待ちください</span>
      </div>)}
    </div>
  )
};
export default ProfilePage;