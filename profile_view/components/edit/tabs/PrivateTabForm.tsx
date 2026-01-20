import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DelimitedTextarea } from "@/components/DelimitedTextarea";
import type { PrivateInfoOut } from "@/types/private_info";

interface PrivateTabFormProps {
  form: UseFormReturn<any>;
  privateInfo: PrivateInfoOut | null;
  isLoading: boolean;
}

export const PrivateTabForm: FC<PrivateTabFormProps> = ({
  form,
  privateInfo,
  isLoading,
}) => {
  return (
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
  );
};
