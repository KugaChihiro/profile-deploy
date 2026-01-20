import { FC } from "react";
import {
  User,
  Tag,
  Droplet,
  Puzzle,
  Users,
  Building,
  History,
  Music,
  Dumbbell,
  Coffee,
  CircleUser,
  Heart,
  Pizza,
} from "lucide-react";
import { PrivateInfoOut } from "@/types/private_info";

interface PrivateTabProps {
  privateInfo: PrivateInfoOut | null;
}

export const PrivateTab: FC<PrivateTabProps> = ({ privateInfo }) => {
  return (
    <div className="space-y-6">
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
                <p className="text-sm text-slate-500">実家家族構成</p>
                <p className="font-medium">{privateInfo?.family_structure}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">親の職業</p>
                {privateInfo?.father_job && (
                  <p className="font-medium">父：{privateInfo?.father_job}</p>
                )}
                {privateInfo?.mother_job && (
                  <p className="font-medium">母：{privateInfo?.mother_job}</p>
                )}
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
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Dumbbell className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">部活</p>
                {privateInfo?.club_activities
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coffee className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">アルバイト</p>
                {privateInfo?.jobs?.split(/[,\/\\・\-、]/).map((item, index) => (
                  <p className="font-medium" key={index}>
                    {item.trim()}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CircleUser className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">サークル</p>
                {privateInfo?.circles
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
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
                {privateInfo?.hobbies
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Pizza className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">好きな食べ物</p>
                {privateInfo?.favorite_foods
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Pizza className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">嫌いな食べ物</p>
                {privateInfo?.disliked_foods
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coffee className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">休日の過ごし方</p>
                {privateInfo?.holiday_activities
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">好きな芸能人</p>
                {privateInfo?.favorite_celebrities
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">好きなキャラクター</p>
                {privateInfo?.favorite_characters
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Music className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">好きなアーティスト</p>
                {privateInfo?.favorite_artists
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">好きなお笑い芸人</p>
                {privateInfo?.favorite_comedians
                  ?.split(/[,\/\\・\-、]/)
                  .map((item, index) => (
                    <p className="font-medium" key={index}>
                      {item.trim()}
                    </p>
                  ))}
              </div>
            </div>

            {privateInfo?.favorite_things_free && (
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">その他好きなもの(自由記述)</p>
                  <p className="font-medium">{privateInfo?.favorite_things_free}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
