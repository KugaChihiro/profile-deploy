"use client"

import type React from "react"
import { useState, useEffect, type FC, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Image from "next/image"
import axios from 'axios'
import { DelimitedTextarea } from "../DelimitedTextarea"
import { BlockBlobClient } from "@azure/storage-blob"


// UIコンポーネントのインポート
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

// APIと型定義のインポート
import { api } from "@/lib/api"
import type { EmployeeOut } from "@/types/employee"
import type { EmploymentHistoryOut } from "@/types/employment_history";
import type { ProjectInfoOut } from "@/types/project_info";
import type { InsightInfoOut } from "@/types/insight_info";
import type { SkillInfoOut } from "@/types/skill_info";
import type { PrivateInfoOut } from "@/types/private_info";
import type { RelatedInfoOut } from "@/types/related_info";

// アイコンのインポート
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
  Loader2,
  Trash
} from "lucide-react"

declare global {
  interface Window {
    __commaAlertShown?: boolean;
    __delimiterAlertShown?: boolean;
  }
}



// フォームのスキーマ定義
const formSchema = z.object({
  employee_id: z.string().or(z.number()).optional().nullable()
    .transform((val) => {
      if (val === '' || val == null) {
        return null;
      }
      return Number(val);
    }),
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
  insight_info: z
    .array(
      z.object({
        insight: z.string().optional().nullable(),
        comment: z.string().optional().nullable(),
        skill: z.string().optional().nullable(),
      }),
    )
    .default([]),
  skill_info: z
    .array(
      z.object({
        skill: z.string().optional().nullable(),
      }),
    )
    .default([]),
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
  activities_free : z.string().optional().nullable(),
  favorite_things_free : z.string().optional().nullable(),
  profile_video: z.string().optional().nullable(),
  profile_thumbnail_url: z.string().optional().nullable(),
  seminar_videos: z
    .array(
      z.object({
        seminar_videos: z.string().optional().nullable(),
        seminar_thumbnail_url: z.string().optional().nullable(),
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
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [employees, setEmployees] = useState<EmployeeOut | null>(null)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryOut | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoOut | null>(null);
  const [insightInfo, setInsightInfo] = useState<InsightInfoOut | null>(null);
  const [skillInfo, setSkillInfo] = useState<SkillInfoOut | null>(null);
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoOut | null>(null);
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEmployeeIdFocused, setIsEmployeeIdFocused] = useState(false);
  // 画像アップロード関連のState
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) ;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetImage,setResetImage] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrlPV, setPreviewUrlPV] = useState<string | null>(null) ;
  const [selectedFilePV, setSelectedFilePV] = useState<File | null>(null);
  const [resetImagePV,setResetImagePV] = useState<boolean | null>(null);
  const fileInputRefP = useRef<HTMLInputElement>(null);

  const [previewSeminarUrls, setPreviewSeminarUrls] = useState<(string | null)[]>([]);
  const [selectedSeminarFiles, setSelectedSeminarFiles] = useState<(File | null)[]>([]);
  const [resetSeminarImages, setResetSeminarImages] = useState<boolean[]>([]);
  const fileInputRefS = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", kana: "", birthdate: undefined, hometown: "", elementary_school: "", junior_high_school: "", high_school: "", university: "", faculty: "", graduate_school: "", major: "", photo_url: "", blood_type: "", nickname: "", mbti: "", family_structure: "", father_job: "", mother_job: "", lessons: "", club_activities: "", jobs: "", circles: "", hobbies: "", favorite_foods: "", disliked_foods: "", holiday_activities: "", favorite_celebrities: "", favorite_characters: "", favorite_artists: "", favorite_comedians: "", activities_free: "", favorite_things_free: "", profile_video: "", profile_thumbnail_url:"", employment_history: [], project_info: [], insight_info: [], skill_info: [], seminar_videos: [],
    },
  })

  const { watch, setValue } = form
  const skills = watch("skill_info")
  const projects = watch("project_info")
  const workHistory = watch("employment_history")
  const knowledge = watch("insight_info")
  const seminarVideos = watch("seminar_videos")

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
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  useEffect(() => {
    if (employees?.photo_url) {
        setPreviewUrl(employees.photo_url);
    }
    if (relatedInfo?.profile_thumbnail_url) {
        setPreviewUrlPV(relatedInfo.profile_thumbnail_url);
    }
    if (employees && employmentHistory && projectInfo && insightInfo && skillInfo && privateInfo && relatedInfo) {
      const formattedValues = {
        ...employees,
        birthdate: employees.birthdate ? new Date(employees.birthdate) : undefined,
        ...privateInfo,
        ...relatedInfo,
        employment_history: employmentHistory.company_name?.split(',').map((name, index) => ({ company_name: name, job_title: employmentHistory.job_title?.split(',')[index] ?? null, start_date: employmentHistory.start_date?.split(',')[index] ?? null, end_date: employmentHistory.end_date?.split(',')[index] ?? null, description: employmentHistory.description?.split(',')[index] ?? null, knowledge: employmentHistory.knowledge?.split(',')[index]?.replace(/\\/g, ',') ?? null, })).filter(item => item.company_name) ?? [],
        project_info: projectInfo.project?.split(',').map((proj, index) => ({ project: proj, comment: projectInfo.comment?.split(',')[index] ?? null, skill: projectInfo.skill?.split(',')[index]?.replace(/\\/g, ',') ?? null, start_date: projectInfo.start_date?.split(',')[index] ?? null, end_date: projectInfo.end_date?.split(',')[index] ?? null, })).filter(item => item.project) ?? [],
        insight_info: insightInfo.insight?.split(',').map((ins, index) => ({ insight: ins, comment: insightInfo.comment?.split(',')[index] ?? null, skill: insightInfo.skill?.split(',')[index]?.replace(/\\/g, ',') ?? null, })).filter(item => item.insight) ?? [],
        skill_info: skillInfo.skill?.split(',').map(s => ({ skill: s })).filter(item => item.skill) ?? [],
        seminar_videos: relatedInfo.seminar_videos?.split(',').map((semi,index) => ({ seminar_videos: semi,seminar_thumbnail_url:relatedInfo.seminar_thumbnail_url?.split(',')[index] ?? null})).filter(item => item.seminar_videos) ?? [],
      };
      const newSeminarThumbnails = formattedValues.seminar_videos
          .map(video => video.seminar_thumbnail_url)

      if (newSeminarThumbnails.length > 0) {
          setPreviewSeminarUrls(newSeminarThumbnails);
      }
      form.reset(formattedValues as FormValues);
    }
  }, [employees, employmentHistory, projectInfo, insightInfo, skillInfo, privateInfo, relatedInfo, form.reset]);

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  }
  const handleUploadButtonClickP = () => {
    fileInputRefP.current?.click();
  }
  const handleUploadButtonClickS = (index:number) => {
    fileInputRefS.current[index]?.click();
  }


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (type === "profile") {
      setSelectedFile(file);
      setResetImage(false);
    } else if (type === "profile_video") {
      setSelectedFilePV(file);
      setResetImagePV(false);
    } else if (type === "seminar_video" && index !== undefined) {
      const newFiles = [...selectedSeminarFiles];
      const newResets = [...resetSeminarImages];

      while (newFiles.length <= index) newFiles.push(null);
      while (newResets.length <= index) newResets.push(false);

      newFiles[index] = file;
      newResets[index] = false;

      setSelectedSeminarFiles(newFiles);
      setResetSeminarImages(newResets);
    }
  };

  const uploadImageAndGetUrl = async (
    file: File,
    type: "profile" | "profile_video" | "seminar_video",
    index?: number
  ): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      let fileName = "";

      // typeに応じてファイル名を決定
      if (type === "profile") {
        fileName = `${id}_profile_image.${fileExtension}`;
      } else if (type === "profile_video") {
        fileName = `${id}_profile_video_thumbnail.${fileExtension}`;
      } else if (type === "seminar_video" && index !== undefined) {
        fileName = `${id}_seminar_video_thumbnail_${index}.${fileExtension}`;
      } else {
        throw new Error("Invalid upload type or missing index.");
      }

      const sasResponse = await api.post(`/generate-sas-token`, { fileName });
      const { sasUrl, storageUrl } = sasResponse.data;
      if (!sasUrl || !storageUrl) throw new Error("SASトークンの取得に失敗しました。");

      const blobClient = new BlockBlobClient(sasUrl);
      await blobClient.uploadData(file, { blobHTTPHeaders: { blobContentType: file.type } });

      return storageUrl;

    } catch (error) {
      console.error("アップロードエラー:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addSkill = () => setValue("skill_info", [...(skills || []), { skill: "" }]);
  const removeSkill = (index: number) => setValue("skill_info", skills.filter((_, i) => i !== index));
  const addWorkHistory = () => setValue("employment_history", [...(workHistory || []), { company_name: "", job_title: "", start_date: undefined, end_date: undefined, description: "", knowledge: "" }]);
  const removeWorkHistory = (index: number) => setValue("employment_history", workHistory.filter((_, i) => i !== index));
  const addKnowledge = () => setValue("insight_info", [...(knowledge || []), { insight: "", comment: "", skill: "" }]);
  const removeKnowledge = (index: number) => setValue("insight_info", knowledge.filter((_, i) => i !== index));
  const addProject = () => {
    const newProjects = [...(projects || []), { project: "", comment: "", skill: "", start_date: undefined, end_date: undefined }];
    setValue("project_info", newProjects);
    setCurrentProjectIndex(newProjects.length - 1);
  };
  const removeProject = (index: number) => {
    setValue("project_info", projects.filter((_, i) => i !== index));
    if (currentProjectIndex >= projects.length - 1) setCurrentProjectIndex(Math.max(0, projects.length - 2));
  };
  const addSeminarVideo = () => setValue("seminar_videos", [...(seminarVideos || []), { seminar_videos: "" }]);
  const removeSeminarVideo = (index: number) => setValue("seminar_videos", seminarVideos.filter((_, i) => i !== index));

  const toLocalDateString = (date: Date): string => {
    const indeterminate = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${indeterminate}-${mm}-${dd}`;
  };

  const onSubmitEmployeeInfo = (data: FormValues) => {
    const { employee_id, name, kana, birthdate, hometown, photo_url, elementary_school, junior_high_school, high_school, university, faculty, graduate_school, major } = data;
    const payload = { employee_id, name, kana, birthdate: birthdate ? toLocalDateString(birthdate) : undefined, hometown, photo_url, elementary_school, junior_high_school, high_school, university, faculty, graduate_school, major };
    return api.put(`/employees/${id}`, payload);
  };
  const onSubmitEmploymentHistory = (data: FormValues) => {
    const historyArray = data.employment_history || [];
    const payload = { company_name: historyArray.map(h => h.company_name ?? "").join(","), job_title: historyArray.map(h => h.job_title ?? "").join(","), start_date: historyArray.map(h => (h.start_date ? new Date(h.start_date).toISOString().split("T")[0] : null)).filter(d => d !== null).join(","), end_date: historyArray.map(h => (h.end_date ? new Date(h.end_date).toISOString().split("T")[0] : null)).filter(d => d !== null).join(","), description: historyArray.map(h => h.description ?? "").join(","), knowledge: historyArray.map(h => (h.knowledge ?? "").split(/[、,]/).join("\\")).join(",") };
    return api.put(`/employment_history/${id}`, payload);
  };
  const onSubmitProjectInfo = (data: FormValues) => {
    const projectArray = data.project_info || [];
    const payload = { project: projectArray.map(p => p.project ?? "").join(","), skill: projectArray.map(p => (p.skill ?? "").split(/[、,]/).join("\\")).join(","), comment: projectArray.map(p => p.comment ?? "").join(","), start_date: projectArray.map(p => (p.start_date ? new Date(p.start_date).toISOString().split("T")[0] : "")).join(","), end_date: projectArray.map(p => (p.end_date ? new Date(p.end_date).toISOString().split("T")[0] : "")).join(",") };
    return api.put(`/project_info/${id}`, payload);
  };
  const onSubmitInsightInfo = (data: FormValues) => {
    const insightArray = data.insight_info || [];
    const payload = { comment: insightArray.map(i => i.comment ?? "").join(","), skill: insightArray.map(p => (p.skill ?? "").split(/[、,]/).join("\\")).join(","), insight: insightArray.map(i => i.insight ?? "").join(",") };
    return api.put(`/insight_info/${id}`, payload);
  };
  const onSubmitSkillInfo = (data: FormValues) => {
    const skillArray = data.skill_info || [];
    const payload = { skill: skillArray.map(s => s.skill ?? "").join(",") };
    return api.put(`/skill_info/${id}`, payload);
  };
  const onSubmitPrivateInfo = (data: FormValues) => {
    const { blood_type, nickname, mbti, family_structure, father_job, mother_job, lessons, club_activities, jobs, circles, hobbies, favorite_foods, disliked_foods, holiday_activities, favorite_celebrities, favorite_characters, favorite_artists, favorite_comedians,activities_free,favorite_things_free } = data;
    const payload = { blood_type, nickname, mbti, family_structure, father_job, mother_job, lessons, club_activities, jobs, circles, hobbies, favorite_foods, disliked_foods, holiday_activities, favorite_celebrities, favorite_characters, favorite_artists, favorite_comedians,activities_free,favorite_things_free };
    return api.put(`/private_info/${id}`, payload);
  };
  const onSubmitRelatedInfo = (data: FormValues) => {
    const seminarArray = data.seminar_videos || [];
    const formattedSeminarVideos = seminarArray
      .map(video => video.seminar_videos ?? "")
      .filter(url => url !== "")
      .join(",");
    const formattedThumbnailUrls = seminarArray
      .map(video => video.seminar_thumbnail_url ?? "")
      .join(",");
    const payload = {
      profile_video: data.profile_video,
      profile_thumbnail_url: data.profile_thumbnail_url,
      seminar_videos: formattedSeminarVideos,
      seminar_thumbnail_url: formattedThumbnailUrls,
    };
    return api.put(`/related_info/${id}`, payload);
  };

  const goTOView = (id: number) => router.push(`/${id}/`);
  const goTOList = () => router.push("../");

  const onSubmit = async (data: FormValues) => {
    let finalData = { ...data };

    if (selectedFile) {
      const newPhotoUrl = await uploadImageAndGetUrl(selectedFile, "profile");
      if (newPhotoUrl) {
        finalData.photo_url = newPhotoUrl;
      } else {
        alert("画像のアップロードに失敗したため、保存を中断しました。");
        return;
      }
    } else {
      delete finalData.photo_url;
    }

    if (resetImage) {
      api.put(`/reset_image/${id}`);
    }


    // --- プロフィール動画サムネイルの処理 ---
    if (selectedFilePV) {
      const newThumbnailUrl = await uploadImageAndGetUrl(selectedFilePV, "profile_video");
      if (newThumbnailUrl) {
        finalData.profile_thumbnail_url = newThumbnailUrl;
      } else {
        alert("画像のアップロードに失敗したため、保存を中断しました。");
        return;
      }
    } else {
      delete finalData.profile_thumbnail_url;
    }

    if (resetImagePV) {
      api.put(`/reset_profile_thumbnail/${id}`);
    }

    // --- セミナー動画サムネイルの処理 ---
    if (selectedSeminarFiles && selectedSeminarFiles.length > 0) {

      for (const [index, file] of selectedSeminarFiles.entries()) {
        // file が null または undefined の場合はスキップ
        if (file != null) {
          const newThumbnailUrl = await uploadImageAndGetUrl(file, "seminar_video", index);
          if (newThumbnailUrl) {
            if (finalData.seminar_videos && finalData.seminar_videos[index]) {
              finalData.seminar_videos[index].seminar_thumbnail_url = newThumbnailUrl;
            }
          } else {
            alert(`セミナー動画${index + 1}の画像アップロードに失敗したため、保存を中断しました。`);
            return;
          }
        }
      }
    }

    const noUploadedThumbnails = selectedSeminarFiles.every((file) => !file);
    const noExistingThumbnails = finalData.seminar_videos.every(
      (video) => !video.seminar_thumbnail_url
    );

    if (noUploadedThumbnails && noExistingThumbnails) {
      // 明示的に削除
      for (const video of finalData.seminar_videos) {
        delete video.seminar_thumbnail_url;
      }
      await api.put(`/reset_seminar_thumbnail/${id}`);
    }


    try {
      // --- DBへの保存処理 ---
      await Promise.all([
        onSubmitEmployeeInfo(finalData),
        onSubmitEmploymentHistory(finalData),
        onSubmitProjectInfo(finalData),
        onSubmitInsightInfo(finalData),
        onSubmitSkillInfo(finalData),
        onSubmitPrivateInfo(finalData),
        onSubmitRelatedInfo(finalData),
      ]);
      alert("すべてのセクションが正常に保存されました");
      goTOList();
    } catch (error) {
      console.error("保存に失敗しました:", error);
      alert("保存中にエラーが発生しました");
    }
  };

    const handleNextTabClick = (e: React.MouseEvent) => {
      e.preventDefault();
      goToNextTab();
    };

    const goToNextTab = () => {
      if (activeTab === "basic") setActiveTab("professional");
      else if (activeTab === "professional") setActiveTab("personal");
      else if (activeTab === "personal") setActiveTab("media");
    };

    const goToPrevTab = () => {
      if (activeTab === "media") setActiveTab("personal");
      else if (activeTab === "personal") setActiveTab("professional");
      else if (activeTab === "professional") setActiveTab("basic");
    };

  const handleResetImage = (type: string, index?: number) => {
    if (type === "profile") {
      setSelectedFile(null);
      setPreviewUrl(null);
      setResetImage(true);
    } else if (type === "profile_video") {
      setSelectedFilePV(null);
      setPreviewUrlPV(null);
      setResetImagePV(true);
    } else if (type === "seminar_video" && index !== undefined) {
      const newFiles = [...selectedSeminarFiles];
      const newUrls = [...previewSeminarUrls];
      const newResets = [...resetSeminarImages];

      while (newFiles.length <= index) newFiles.push(null);
      while (newUrls.length <= index) newUrls.push(null);
      while (newResets.length <= index) newResets.push(false);

      newFiles[index] = null;
      newUrls[index] = null;
      newResets[index] = true;

      setSelectedSeminarFiles(newFiles);
      setPreviewSeminarUrls(newUrls);
      setResetSeminarImages(newResets);

      setValue(`seminar_videos.${index}.seminar_thumbnail_url`, null);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">プロフィール登録</h1>
        <div className = "flex gap-10 py-8 justify-end mr-4">
          <div className="text-sm text-right p-0 m-0 md:text-base">
            {employees && ( <button className="bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none" onClick={() => goTOView(employees.id)} disabled={form.formState.isSubmitting}>閲覧画面に戻る</button> )}
          </div>
          <div className="text-sm text-right p-0 m-0 md:text-base">
            <button className = "bg-gray-500 text-white rounded-full py-1.5 px-6 outline-none" onClick = {goTOList} disabled={form.formState.isSubmitting}>一覧に戻る</button>
          </div>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-md">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 p-1 w-full">
                  <TabsTrigger value="basic" className="flex items-center gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">基本情報</span></TabsTrigger>
                  <TabsTrigger value="professional" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">業務情報</span></TabsTrigger>
                  <TabsTrigger value="personal" className="flex items-center gap-2"><Heart className="h-4 w-4" /><span className="hidden sm:inline">プライベート情報</span></TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2"><Film className="h-4 w-4" /><span className="hidden sm:inline">関連情報</span></TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[70vh] px-6 py-4">
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">プロフィール写真</h2>
                      <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {selectedFile ? (
                            <div className="text-center text-xs font-semibold text-slate-600 p-2">Already<br />Selected</div>
                          ) : previewUrl ? (
                            <Image src={previewUrl} alt="プロフィール写真" layout="fill" objectFit="cover" />
                          ) : (
                            <User className="h-12 w-12 text-slate-400" />
                          )}
                        </div>

                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, "profile")} className="hidden" accept="image/png, image/jpeg, image/gif" />
                          <div className="flex items-center gap-4">
                            {/* 写真を選択 */}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleUploadButtonClick}
                              disabled={form.formState.isSubmitting || isLoading}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              写真を選択
                            </Button>

                            {/* 選択中のときだけ表示 */}
                            {(selectedFile || previewUrl) && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleResetImage("profile")}
                                disabled={isLoading}
                              >
                                <Trash className="mr-2 h-4 w-4"/>
                                選択した写真をリセット
                              </Button>
                            )}
                          </div>
                      </div>
                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">基本情報</h2>
                      <div className="grid grid-cols-1 gap-4 px-1">
                        <FormField control={form.control} name="employee_id" render={({ field }) => (<FormItem><FormLabel>社員番号</FormLabel><FormControl><Input {...field} readOnly={isLoading} placeholder="5桁の社員番号を入力" value={isEmployeeIdFocused ? (field.value ?? "") : String(field.value ?? "").padStart(5, '0')} onChange={(e) => e.target.value.length > 5 ? alert("社員番号は5桁以内で入力してください。") : field.onChange(e.target.value === "" ? null : isNaN(Number(e.target.value)) ? null : Number(e.target.value))} onFocus={() => setIsEmployeeIdFocused(true)} onBlur={() => (setIsEmployeeIdFocused(false), field.onBlur())} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>氏名</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.name ?? "氏名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="kana" render={({ field }) => ( <FormItem><FormLabel>フリガナ</FormLabel><FormControl><Input readOnly={isLoading}  placeholder={employees?.kana ?? "フリガナを記入"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <FormField control={form.control} name="birthdate" render={({ field }) => ( <FormItem className="flex flex-col px-1"><FormLabel>生年月日</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button disabled={isLoading} variant={"outline"} className={`w-[97%] m-2 pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}>{field.value ? format(field.value, "yyyy-MM-dd", { locale: ja }) : employees?.birthdate ? format(new Date(employees.birthdate), "yyyy-MM-dd", { locale: ja }) : "誕生日を選択"}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} classNames={{ caption_label: "hidden", caption_dropdowns: "flex gap-2 justify-center", dropdown: "border px-2 py-1 rounded-md text-sm", dropdown_year: "bg-white", dropdown_month: "bg-white", }} /></PopoverContent></Popover><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="hometown" render={({ field }) => ( <FormItem className="px-1"><FormLabel>出身地</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.hometown ?? "出身地を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">学歴</h2>
                      <FormField control={form.control} name="elementary_school" render={({ field }) => ( <FormItem className="px-1"><FormLabel>小学校</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.elementary_school ?? "小学校名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="junior_high_school" render={({ field }) => ( <FormItem className="px-1"><FormLabel>中学校</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.junior_high_school ?? "中学校名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="high_school" render={({ field }) => ( <FormItem className="px-1"><FormLabel>高校</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.high_school ?? "高校名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="university" render={({ field }) => ( <FormItem className="px-1"><FormLabel>大学</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.university ?? "大学名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="faculty" render={({ field }) => ( <FormItem className="px-1"><FormLabel>学部学科</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.faculty ?? "大学における所属学部及び学科を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="graduate_school" render={({ field }) => ( <FormItem className="px-1"><FormLabel>大学院</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.graduate_school ?? "大学院名を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="major" render={({ field }) => ( <FormItem className="px-1"><FormLabel>専攻</FormLabel><FormControl><Input readOnly={isLoading} placeholder={employees?.major ?? "大学院における専攻を入力"} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">職歴</h2>
                      <div className="space-y-6">
                        {(workHistory ?? []).map((work, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button disabled={isLoading} type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeWorkHistory(index)}><X className="h-4 w-4" /></Button>
                            <div className="mb-4"><FormField control={form.control} name={`employment_history.${index}.company_name`} render={({ field }) => ( <FormItem><FormLabel>会社名</FormLabel><FormControl><Input readOnly={isLoading} placeholder="会社名を入力 / 記入例 : 株式会社〇〇" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                              <FormField control={form.control} name={`employment_history.${index}.start_date`} render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>開始日</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button disabled={isLoading} variant={"outline"} className={`pl-3 text-left font-normal w-[97%] m-2 ${!field.value ? "text-muted-foreground" : ""}`}>{field.value ? field.value : <span>開始日を選択</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)} initialFocus captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} classNames={{caption_label: "hidden",caption_dropdowns: "flex gap-2 justify-center",dropdown: "border px-2 py-1 rounded-md text-sm",dropdown_year: "bg-white",dropdown_month: "bg-white"}}/></PopoverContent></Popover><FormMessage /></FormItem> )} />
                              <FormField control={form.control} name={`employment_history.${index}.end_date`} render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>終了日</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button disabled={isLoading} variant={"outline"} className={`pl-3 text-left font-normal w-[97%] m-2 ${!field.value ? "text-muted-foreground" : ""}`}>{field.value ? field.value : <span>終了日を選択</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)} initialFocus captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} classNames={{caption_label: "hidden",caption_dropdowns: "flex gap-2 justify-center",dropdown: "border px-2 py-1 rounded-md text-sm",dropdown_year: "bg-white",dropdown_month: "bg-white"}}/></PopoverContent></Popover><FormMessage /></FormItem> )} />
                            </div>
                            <FormField control={form.control} name={`employment_history.${index}.job_title`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>職種</FormLabel><FormControl><Input  readOnly={isLoading}placeholder="職種名を入力 / 記入例 : バックエンドエンジニア" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`employment_history.${index}.description`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>業務内容</FormLabel><FormControl><Textarea readOnly={isLoading} placeholder="業務内容を入力 / 記入例 : 社内システムの作成" {...field} rows={3} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`employment_history.${index}.knowledge`} render={({ field }) => (<FormItem><FormLabel>獲得した知見</FormLabel><FormControl><Input readOnly={isLoading} placeholder="獲得知見のタイトルを入力 / 記入例 : データベース接続 / Azureの使用" {...field} value={field.value ?? ""} onChange={(e) => { const v = e.target.value; if (v.includes(",") && !window.__commaAlertShown) { alert("カンマ（,）は自動的にスラッシュ（/）へ変換されます。"); window.__commaAlertShown = true; } field.onChange(v.replace(/,/g, "/")); }} /></FormControl><FormMessage /></FormItem>)}/>
                          </div>
                        ))}
                        <Button disabled={isLoading} type="button" variant="outline" className="w-full" onClick={addWorkHistory}><Plus className="mr-2 h-4 w-4" /> 職歴を追加</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="professional" className="space-y-6 mt-0">
                    <div>
                      <a
                        href="https://black-sea-021879300.1.azurestaticapps.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
                      >
                        プロジェクト管理ツールへ →
                      </a>
                      { /*
                      <div className="space-y-4" >
                        <h2 className="text-xl font-semibold">スキル</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(skills?? []).map((item, index) => (
                            <div key={index} >
                              <Button disabled={isLoading} type="button" variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => removeSkill(index)}><X className="h-3 w-3" /></Button>
                              <FormField control={form.control} name={`skill_info.${index}.skill`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>タイトル</FormLabel><FormControl><Input readOnly={isLoading} placeholder="スキル名を入力 / 記入例 : React" {...field} value={field.value ?? ""} className = "placeholder:text-[11px]"/></FormControl><FormMessage /></FormItem> )} />
                            </div>
                          ))}
                        </div>
                        <Button type="button" onClick={addSkill}>追加</Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">知見</h2>
                      <div className="space-y-4">
                        {(knowledge?? []).map((item, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button disabled={isLoading}  type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeKnowledge(index)}><X className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`insight_info.${index}.insight`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>タイトル</FormLabel><FormControl><Input readOnly={isLoading} placeholder="獲得知見のタイトルを入力 / 記入例 : データベース接続" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`insight_info.${index}.comment`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>補足</FormLabel><FormControl><Textarea readOnly={isLoading} placeholder="獲得知見に関する補足的情報を入力" {...field} rows={3} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`insight_info.${index}.skill`} render={({ field }) => (<FormItem><FormLabel>関連スキル</FormLabel><FormControl><Input readOnly={isLoading} placeholder="獲得スキルを入力 / 記入例:スキル1,スキル2" {...field} value={field.value ?? ""} onChange={(e) => { const original = e.target.value; const replaced = original.replace(/[・\/、\-\\\s\u3000]/g, "\\"); if (original !== replaced && !window.__delimiterAlertShown) { alert("他の区切り文字（スペース スラッシュ バックスラッシュ 読点 中点 ハイフン 等）はカンマ（,）に自動変換されます。"); window.__delimiterAlertShown = true; } field.onChange(replaced); }} /></FormControl><FormMessage /></FormItem>)}/>
                          </div>
                        ))}
                        <Button disabled={isLoading} type="button" variant="outline" className="w-full" onClick={addKnowledge}><Plus className="mr-2 h-4 w-4" /> 知見を追加</Button>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">参画プロジェクト</h2>
                      <div className="space-y-4">
                        {(projects ?? []).map((_, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <Button disabled={isLoading} type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeProject(index)}><X className="h-4 w-4" /></Button>
                            <div className="mb-4"><FormField control={form.control} name={`project_info.${index}.project`} render={({ field }) => ( <FormItem><FormLabel>プロジェクト名</FormLabel><FormControl><Input readOnly={isLoading} placeholder="プロジェクト名を入力 / 記入例 : 人材管理システムリニューアル" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                              <FormField control={form.control} name={`project_info.${index}.start_date`} render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>開始日</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button disabled={isLoading} variant={"outline"} className={`w-[97%] m-2 pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}>{field.value ? field.value : <span>開始日を選択</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)} initialFocus captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} classNames={{caption_label: "hidden",caption_dropdowns: "flex gap-2 justify-center",dropdown: "border px-2 py-1 rounded-md text-sm",dropdown_year: "bg-white",dropdown_month: "bg-white"}}/></PopoverContent></Popover><FormMessage /></FormItem> )} />
                              <FormField control={form.control} name={`project_info.${index}.end_date`} render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>終了日</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button disabled={isLoading} variant={"outline"} className={`w-[97%] m-2 pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}>{field.value ? field.value : <span>終了日を選択</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)} initialFocus captionLayout="dropdown" fromYear={1900} toYear={new Date().getFullYear()} classNames={{caption_label: "hidden",caption_dropdowns: "flex gap-2 justify-center",dropdown: "border px-2 py-1 rounded-md text-sm",dropdown_year: "bg-white",dropdown_month: "bg-white"}}/></PopoverContent></Popover><FormMessage /></FormItem> )} />
                            </div>
                            <div className="mb-4"><FormField control={form.control} name={`project_info.${index}.end_client_industry`} render={({ field }) => ( <FormItem><FormLabel>エンドクライアント業界分類</FormLabel><FormControl><Input readOnly={isLoading} placeholder="エンドクライアント業界分類を入力" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} /></div>
                            <div className="mb-4"><FormField control={form.control} name={`project_info.${index}.project_purpose`} render={({ field }) => ( <FormItem><FormLabel>プロジェクト目的分類</FormLabel><FormControl><Input readOnly={isLoading} placeholder="プロジェクト目的分類" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} /></div>
                            <FormField control={form.control} name={`project_info.${index}.comment`} render={({ field }) => ( <FormItem className="mb-4"><FormLabel>補足</FormLabel><FormControl><Textarea readOnly={isLoading} placeholder="プロジェクトに関する補足的情報を記入" {...field} rows={3} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`project_info.${index}.skill`} render={({ field }) => (<FormItem><FormLabel>獲得スキル</FormLabel><FormControl><Input readOnly={isLoading} placeholder="獲得スキルを記入 / 記入例 : スキル1,スキル2" {...field} value={field.value ?? ""} onChange={(e) => { const original = e.target.value; const replaced = original.replace(/[・\/、\-\\\s\u3000]/g, ","); if (original !== replaced && !window.__delimiterAlertShown) { alert("他の区切り文字（スペース スラッシュ バックスラッシュ 読点 中点 ハイフン 等）はカンマ（,）に自動変換されます。"); window.__delimiterAlertShown = true; } field.onChange(replaced); }} /></FormControl><FormMessage /></FormItem>)}/>
                          </div>
                        ))}
                        <Button disabled={isLoading} type="button" variant="outline" className="w-full" onClick={addProject}><Plus className="mr-2 h-4 w-4" /> プロジェクトを追加</Button>
                      </div>
                    */}
                    </div>
                  </TabsContent>


                  <TabsContent value="personal" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">家族・背景</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField control={form.control} name="family_structure" render={({ field }) => ( <FormItem><FormLabel>実家家族構成</FormLabel><FormControl><Input placeholder={privateInfo?.family_structure ?? "家族構成を入力 / 記入例 : 父・母・本人"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="father_job" render={({ field }) => ( <FormItem><FormLabel>父親の職業</FormLabel><FormControl><Input placeholder={privateInfo?.father_job ?? "職業名を入力"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                          <FormField control={form.control} name="mother_job" render={({ field }) => ( <FormItem><FormLabel>母親の職業</FormLabel><FormControl><Input placeholder={privateInfo?.mother_job ?? "職業名を入力"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="blood_type" render={({ field }) => ( <FormItem><FormLabel>血液型</FormLabel><FormControl><Input placeholder={privateInfo?.blood_type ?? "血液型を入力 / 記入例 : O型"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                          <FormField control={form.control} name="nickname" render={({ field }) => ( <FormItem><FormLabel>ニックネーム</FormLabel><FormControl><Input placeholder={privateInfo?.nickname ?? "ニックネームを入力"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="mbti" render={({ field }) => ( <FormItem><FormLabel>MBTI（性格タイプ）</FormLabel><FormControl><Input placeholder={privateInfo?.mbti ?? "MBTIを入力 / 記入例 : ISTJ"} {...field} value={field.value ?? ""} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">活動歴</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField control={form.control} name="lessons" render={({ field }) => ( <FormItem><FormLabel>習い事</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.lessons ?? "習い事を入力 / 記入例 : 水泳 (2歳～10歳), ピアノ (5歳～10歳)"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="club_activities" render={({ field }) => ( <FormItem><FormLabel>部活</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.club_activities ?? "部活を入力 / 記入例 : サッカー部 (中学), テニス部 (高校)"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="jobs" render={({ field }) => ( <FormItem><FormLabel>アルバイト</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.jobs ?? "アルバイト経験を入力/ 記入例 : カフェ店員 (大学1年時), レストランスタッフ (大学2年時)"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="circles" render={({ field }) => ( <FormItem><FormLabel>サークル</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.circles ?? "サークル活動を入力"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="activities_free" render={({ field }) => ( <FormItem><FormLabel>その他の活動歴</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.activities_free ?? "その他の活動歴（自由記述）"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">趣味・好み</h2>
                      <div className="grid grid-cols-1 gap-4  pb-2">
                        <FormField control={form.control} name="hobbies" render={({ field }) => ( <FormItem><FormLabel>趣味</FormLabel><FormControl></FormControl><FormMessage /><DelimitedTextarea placeholder={privateInfo?.hobbies ?? "趣味を入力 / 記入例 : テニス ・ カラオケ"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading} /></FormItem> )} />
                        <FormField control={form.control} name="favorite_foods" render={({ field }) => ( <FormItem><FormLabel>好きな食べ物</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_foods ?? "好きな食べ物を入力 / 記入例 : 焼肉 ・ ラーメン"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="disliked_foods" render={({ field }) => ( <FormItem><FormLabel>苦手な食べ物</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.disliked_foods ?? "嫌いな食べ物を入力 / 記入例 : ゴーヤ ・ ピーマン"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="holiday_activities" render={({ field }) => ( <FormItem><FormLabel>休日の過ごし方</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.holiday_activities ?? "休日の過ごし方を入力 / 記入例 : 友達と外食 ・ 一人カラオケ"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="favorite_celebrities" render={({ field }) => ( <FormItem><FormLabel>好きな芸能人</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_celebrities ?? "好きな芸能人を入力 / 記入例 : 佐藤健 ・ 新垣結衣 ・ 星野源"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="favorite_characters" render={({ field }) => ( <FormItem><FormLabel>好きなキャラクター</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_characters ?? "好きなキャラクターを入力 / 記入例 : ドラえもん ・ スヌーピー"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="favorite_artists" render={({ field }) => ( <FormItem><FormLabel>好きなアーティスト</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_artists ?? "好きなアーティストを入力 / 記入例 : Official髭男dism ・ あいみょん"} value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="favorite_comedians" render={({ field }) => ( <FormItem><FormLabel>好きな芸人</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_comedians ?? "好きな芸人を入力 / 記入例 : サンドウィッチマン ・ 千鳥"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="favorite_things_free" render={({ field }) => ( <FormItem><FormLabel>その他の好きなもの・こと</FormLabel><FormControl><DelimitedTextarea placeholder={privateInfo?.favorite_things_free ?? "その他の好きなもの・ことを入力（自由記述）"}  value={field.value ?? ""} onChange={field.onChange} rows={2} readOnly={isLoading}/></FormControl><FormMessage /></FormItem> )} />
                      </div>
                    </div>
                  </TabsContent>

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
                                <Input placeholder="動画URLを入力 / 記入例 : https://example.com/video" {...field} value={field.value ?? ""} readOnly={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <p className="mt-[20px] mb-[10px] text-[14px] font-medium">サムネイル画像</p>
                        <div className="flex items-center gap-6">
                          <div className="relative h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                            {selectedFilePV ? (
                              <div className="text-center text-xs font-semibold text-slate-600 p-2">Already<br />Selected</div>
                            ) : previewUrlPV ? (
                              <Image src={previewUrlPV} alt="プロフィール動画サムネイル" layout="fill" objectFit="cover" />
                            ) : (
                              <User className="h-12 w-12 text-slate-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRefP}
                            onChange={(e) => handleFileChange(e, "profile_video")}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                          />
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleUploadButtonClickP}
                              disabled={form.formState.isSubmitting || isLoading}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              サムネイル画像を選択
                            </Button>

                            {(selectedFilePV || previewUrlPV || relatedInfo?.profile_thumbnail_url) && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleResetImage("profile_video")}
                                disabled={isLoading}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                選択した写真をリセット
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <h2 className="text-xl font-semibold">セミナー動画</h2>
                      <div className="space-y-4">
                        {(seminarVideos ?? []).map((video, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeSeminarVideo(index)} disabled={isLoading}>
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center p-6">
                                  <Upload className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                                  <p className="text-slate-500">動画をアップロード</p>
                                </div>
                              </div>
                              <FormField control={form.control} name={`seminar_videos.${index}.seminar_videos`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>動画URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/video" {...field} value={field.value ?? ""} readOnly={isLoading} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <p className="mt-[20px] mb-[10px] text-[14px] font-medium">サムネイル画像</p>
                              <div className="flex items-center gap-6">
                                <div className="relative h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                  {selectedSeminarFiles[index] ? (
                                    <div className="text-center text-xs font-semibold text-slate-600 p-2">Already<br />Selected</div>
                                  ) : previewSeminarUrls[index] ? (
                                    <Image src={previewSeminarUrls[index]!} alt="セミナー動画サムネイル" layout="fill" objectFit="cover" />
                                  ) :  (
                                    <User className="h-12 w-12 text-slate-400" />
                                  )}
                                </div>
                                <input
                                  type="file"
                                  ref={(el) => { fileInputRefS.current[index] = el; }}
                                  onChange={(e) => handleFileChange(e, "seminar_video", index)}
                                  className="hidden"
                                  accept="image/png, image/jpeg, image/gif"
                                />
                                <div className="flex items-center gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={()=>handleUploadButtonClickS(index)}
                                    disabled={form.formState.isSubmitting || isLoading}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    サムネイル画像を選択
                                  </Button>

                                  {(selectedSeminarFiles[index] || video.seminar_thumbnail_url) && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => handleResetImage("seminar_video", index)}
                                      disabled={isLoading}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      選択した写真をリセット
                                    </Button>
                                  )}
                                </div>
                              </div>
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
              <Button type="button" variant="outline" onClick={goToPrevTab} disabled={activeTab === "basic" || form.formState.isSubmitting }>
                <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
              </Button>


                <div className= "flex gap-8">
                  <Button type="button" onClick={handleNextTabClick} disabled={activeTab === "media" || form.formState.isSubmitting}>
                    次へ <ChevronRight className="ml-2 h-4 w-4"/>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting || isUploading  || isLoading}>
                    {(form.formState.isSubmitting || isUploading) ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Save className="mr-2 h-4 w-4" />)}
                    {(form.formState.isSubmitting || isUploading) ? "保存中..." : "保存"}
                  </Button>
                </div>

            </CardFooter>
          </Card>
        </form>
      </Form>
      {isLoading && (<div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 shadow-lg rounded-lg border z-50">
        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
        <span className="text-sm">データ取得中…<br/>少々お待ちください</span>
      </div>)}
    </div>
  )
}

export default ProfileForm