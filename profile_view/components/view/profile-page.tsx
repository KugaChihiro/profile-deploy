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
  Carrot
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



  useEffect(() => {

    api.get(`/employees/${id}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/employment_history/${id}`)
      .then((res) => {
        setEmploymentHistory(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/project_info/${id}`)
      .then((res) => {
        setProjectInfo(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/insight_info/${id}`)
      .then((res) => {
        setInsightInfo(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/skill_info/${id}`)
      .then((res) => {
        setSkillInfo(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/private_info/${id}`)
      .then((res) => {
        setPrivateInfo(res.data);
      })
      .catch((err) => console.error(err));

    api.get(`/related_info/${id}`)
      .then((res) => {
        setRelatedInfo(res.data);
      })
      .catch((err) => console.error(err));

  }, []);

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Card className="shadow-lg border-none">
        <CardContent className="p-0">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-t-lg"></div>
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
                          <h3 className="font-semibold mb-2">{insightInfo.insight}</h3>
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
                      <Music className="h-6 w-6" />
                      活動歴
                    </h2>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Music className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">習い事</p>
                                {privateInfo?.lessons?.split(',').map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                                ))}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Dumbbell className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">部活</p>
                                {privateInfo?.club_activities?.split(',').map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                                ))}
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Coffee className="h-5 w-5 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-500">アルバイト</p>
                                {privateInfo?.jobs?.split(',').map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                                ))}
                            </div>
                          </div>
                        <div className="flex items-start gap-3">
                          <CircleUser className="h-5 w-5 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-500">サークル</p>
                              {privateInfo?.circles?.split(',').map((item, index) => (
                                  <p className="font-medium" key={index}>{item.trim()}</p>
                              ))}
                          </div>
                        </div>
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
                          {privateInfo?.hobbies?.split(',').map((item, index) => (
                            <p className="font-medium" key={index}>{item.trim()}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Pizza className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな食べ物</p>
                            {privateInfo?.favorite_foods?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Carrot className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">嫌いな食べ物</p>
                          <p className="font-medium">{privateInfo?.disliked_foods}</p>

                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Palmtree className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">休日の過ごし方</p>
                            {privateInfo?.holiday_activities?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Tv className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな芸能人</p>
                            {privateInfo?.favorite_celebrities?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ToyBrick className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなキャラクター</p>
                            {privateInfo?.favorite_characters?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mic className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなアーティスト</p>
                            {privateInfo?.favorite_artists?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Smile className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きなお笑い芸人</p>
                            {privateInfo?.favorite_comedians?.split(',').map((item, index) => (
                              <p className="font-medium" key={index}>{item.trim()}</p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">プロフィール動画</h2>
                  {relatedInfo?.profile_video? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        src={relatedInfo?.profile_video  || undefined}
                      >
                      </video>
                    </div>
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
                    {relatedInfo?.seminar_videos?.split(',').map((item, index) => (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden"  key={index}>
                        <video
                          className="w-full h-full object-cover"
                          controls
                          src={item  || undefined}
                        >
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};
export default ProfilePage;