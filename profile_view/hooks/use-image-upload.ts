import { useState, useRef } from "react";
import { BlockBlobClient } from "@azure/storage-blob";
import { api } from "@/lib/api";

export type ImageType = "profile" | "profile_video" | "seminar_video";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  // プロフィール写真
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetImage, setResetImage] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // プロフィール動画サムネイル
  const [previewUrlPV, setPreviewUrlPV] = useState<string | null>(null);
  const [selectedFilePV, setSelectedFilePV] = useState<File | null>(null);
  const [resetImagePV, setResetImagePV] = useState<boolean | null>(null);
  const fileInputRefP = useRef<HTMLInputElement>(null);

  // セミナー動画サムネイル（複数）
  const [previewSeminarUrls, setPreviewSeminarUrls] = useState<(string | null)[]>([]);
  const [selectedSeminarFiles, setSelectedSeminarFiles] = useState<(File | null)[]>([]);
  const [resetSeminarImages, setResetSeminarImages] = useState<boolean[]>([]);
  const fileInputRefS = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * ファイル選択時の処理
   */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: ImageType,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  /**
   * 画像をアップロードしてURLを取得
   */
  const uploadImageAndGetUrl = async (
    file: File,
    type: ImageType,
    index?: number
  ): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileExtension = file.name.split(".").pop();
      let fileName = "";

      if (type === "profile") {
        fileName = `profile.${fileExtension}`;
      } else if (type === "profile_video") {
        fileName = `profile_thumbnail.${fileExtension}`;
      } else if (type === "seminar_video" && index !== undefined) {
        fileName = `seminar_thumbnail_${index}.${fileExtension}`;
      } else {
        throw new Error("Invalid image type");
      }

      const sasResponse = await api.post(`/generate-sas-token`, { fileName });
      const { sasUrl, storageUrl } = sasResponse.data;
      
      if (!sasUrl || !storageUrl) {
        throw new Error("SASトークンの取得に失敗しました");
      }

      const blobClient = new BlockBlobClient(sasUrl);
      await blobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      return storageUrl;
    } catch (error) {
      console.error("アップロードエラー:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * アップロードボタンのクリック処理
   */
  const handleUploadButtonClick = (type: ImageType, index?: number) => {
    if (type === "profile") {
      fileInputRef.current?.click();
    } else if (type === "profile_video") {
      fileInputRefP.current?.click();
    } else if (type === "seminar_video" && index !== undefined) {
      fileInputRefS.current[index]?.click();
    }
  };

  /**
   * 画像リセット処理
   */
  const handleResetImage = (type: ImageType, index?: number) => {
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
    }
  };

  /**
   * プレビューURLを設定
   */
  const setPreviewUrlByType = (url: string | null, type: ImageType, index?: number) => {
    if (type === "profile") {
      setPreviewUrl(url);
    } else if (type === "profile_video") {
      setPreviewUrlPV(url);
    } else if (type === "seminar_video" && index !== undefined) {
      const newUrls = [...previewSeminarUrls];
      while (newUrls.length <= index) newUrls.push(null);
      newUrls[index] = url;
      setPreviewSeminarUrls(newUrls);
    }
  };

  return {
    // 状態
    isUploading,
    
    // プロフィール写真
    previewUrl,
    selectedFile,
    resetImage,
    fileInputRef,
    setPreviewUrl,
    
    // プロフィール動画サムネイル
    previewUrlPV,
    selectedFilePV,
    resetImagePV,
    fileInputRefP,
    setPreviewUrlPV,
    
    // セミナー動画サムネイル
    previewSeminarUrls,
    selectedSeminarFiles,
    resetSeminarImages,
    fileInputRefS,
    setPreviewSeminarUrls,
    
    // メソッド
    handleFileChange,
    uploadImageAndGetUrl,
    handleUploadButtonClick,
    handleResetImage,
    setPreviewUrlByType,
  };
};
