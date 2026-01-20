import { FC } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { User, Upload, Plus, X, Trash } from "lucide-react";
import type { RelatedInfoOut } from "@/types/related_info";

interface RelatedInfoTabFormProps {
  form: UseFormReturn<any>;
  relatedInfo: RelatedInfoOut | null;
  isLoading: boolean;
  previewUrlPV: string | null;
  selectedFilePV: File | null;
  fileInputRefP: React.RefObject<HTMLInputElement | null>;
  previewSeminarUrls: (string | null)[];
  selectedSeminarFiles: (File | null)[];
  fileInputRefS: React.MutableRefObject<(HTMLInputElement | null)[]>;
  seminarVideos: any[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: any, index?: number) => void;
  handleUploadButtonClick: (type: any, index?: number) => void;
  handleResetImage: (type: any, index?: number) => void;
  addSeminarVideo: () => void;
  removeSeminarVideo: (index: number) => void;
}

export const RelatedInfoTabForm: FC<RelatedInfoTabFormProps> = ({
  form,
  relatedInfo,
  isLoading,
  previewUrlPV,
  selectedFilePV,
  fileInputRefP,
  previewSeminarUrls,
  selectedSeminarFiles,
  fileInputRefS,
  seminarVideos,
  handleFileChange,
  handleUploadButtonClick,
  handleResetImage,
  addSeminarVideo,
  removeSeminarVideo,
}) => {
  return (
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
              onClick={() => handleUploadButtonClick("profile_video")}
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
        {(seminarVideos ?? []).map((video: any, index: number) => (
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
                  ) : (
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
                    onClick={() => handleUploadButtonClick("seminar_video", index)}
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
  );
};
