import { FC } from "react";
import { Film, Link as LinkIcon } from "lucide-react";
import { VideoUnit } from "@/lib/profile-utils";
import { RelatedInfoOut } from "@/types/related_info";

interface RelatedInfoTabProps {
  relatedInfo: RelatedInfoOut | null;
  seminarVideos: VideoUnit[];
  onProfileVideoClick: (url: string) => void;
  onSeminarVideoClick: (url: string) => void;
}

export const RelatedInfoTab: FC<RelatedInfoTabProps> = ({
  relatedInfo,
  seminarVideos,
  onProfileVideoClick,
  onSeminarVideoClick,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">プロフィール動画</h2>
        {relatedInfo?.profile_video ? (
          <>
            <div
              className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => onProfileVideoClick(relatedInfo?.profile_video ?? "")}
            >
              <video
                className="w-full h-full object-cover"
                controls
                src={relatedInfo?.profile_video || undefined}
                poster={relatedInfo?.profile_thumbnail_url || undefined}
              ></video>
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                <p className="text-white text-sm sm:text-base px-4 text-center pointer-events-none">
                  動画が表示されない場合はここをクリック
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-md border-gray-300 text-gray-700 break-all select-text cursor-text flex gap-2">
              <LinkIcon />
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
          {seminarVideos.map((item, index) => (
            <div className="flex flex-col" key={index}>
              {item ? (
                <div
                  className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => onSeminarVideoClick(item.video_url ?? "")}
                >
                  <video
                    className="w-full h-full object-cover"
                    controls
                    src={item.video_url || undefined}
                    poster={item?.thumbnail_url || undefined}
                  ></video>
                  <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                    <p className="text-white text-sm sm:text-base px-4 text-center pointer-events-none">
                      動画が表示されない場合はここをクリック
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full object-cover aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <Film className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-500">セミナー動画がここに表示されます</p>
                  </div>
                </div>
              )}

              {item ? (
                <div className="mt-4 p-3 bg-gray-100 rounded-md border-gray-300 text-gray-700 break-all select-text cursor-text flex gap-2 items-center">
                  <LinkIcon />
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
                <span className="text-s" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
