"use client"

import { useState, FC } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useProfileData } from "@/hooks/use-profile-data";
import {
  parseEmploymentHistory,
  parseProjectInfo,
  parseInsightInfo,
  parseSkillInfo,
  parseSeminarInfo,
} from "@/lib/profile-utils";
import { BasicTab } from "@/components/view/tabs/BasicTab";
import { ProjectTab } from "@/components/view/tabs/ProjectTab";
import { PrivateTab } from "@/components/view/tabs/PrivateTab";
import { RelatedInfoTab } from "@/components/view/tabs/RelatedInfoTab";
import {
  User,
  Briefcase,
  Heart,
  Film,
  Loader2,
} from "lucide-react"


type Props = {
  id: number;
};


const ProfilePage: FC<Props> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("basic")
  const router = useRouter()

  // カスタムフックでデータ取得
  const {
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
  } = useProfileData(id);

  const goTOEdition = (id: number) => {
    router.push(`/${id}/edit`);
  }

  const goTOList = () => {
    router.push("../")
  }

  const ProfileVideoClick = (url: string) => {
    window.open(url, "_blank");
  }

  const SeminarVideoClick = (url: string) => {
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
                <BasicTab
                  employees={employees}
                  employmentHistory={parseEmploymentHistory(employmentHistory)}
                />
              </TabsContent>

              <TabsContent value="professional" className="space-y-8">
                <ProjectTab
                  managementProjects={managementProjects}
                  projectMembers={projectMembers}
                  employees={employees}
                />
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <PrivateTab privateInfo={privateInfo} />
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <RelatedInfoTab
                  relatedInfo={relatedInfo}
                  seminarVideos={parseSeminarInfo(relatedInfo)}
                  onProfileVideoClick={ProfileVideoClick}
                  onSeminarVideoClick={SeminarVideoClick}
                />
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