import { FC } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { User, CalendarIcon, Plus, X, Upload, Trash } from "lucide-react";
import type { EmployeeOut } from "@/types/employee";

interface BasicTabFormProps {
  form: UseFormReturn<any>;
  employees: EmployeeOut | null;
  isLoading: boolean;
  isEmployeeIdFocused: boolean;
  setIsEmployeeIdFocused: (focused: boolean) => void;
  workHistory: any[];
  addWorkHistory: () => void;
  removeWorkHistory: (index: number) => void;
  previewUrl: string | null;
  selectedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: any, index?: number) => void;
  handleUploadButtonClick: (type: any, index?: number) => void;
  handleResetImage: (type: any, index?: number) => void;
}

export const BasicTabForm: FC<BasicTabFormProps> = ({
  form,
  employees,
  isLoading,
  isEmployeeIdFocused,
  setIsEmployeeIdFocused,
  workHistory,
  addWorkHistory,
  removeWorkHistory,
  previewUrl,
  selectedFile,
  fileInputRef,
  handleFileChange,
  handleUploadButtonClick,
  handleResetImage,
}) => {
  return (
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
          <Button
            type="button"
            variant="outline"
            onClick={() => handleUploadButtonClick("profile")}
            disabled={form.formState.isSubmitting || isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            写真を選択
          </Button>

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
        {(workHistory ?? []).map((work: any, index: number) => (
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
  );
};
