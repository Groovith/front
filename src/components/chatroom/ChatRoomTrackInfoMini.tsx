import { ListMusic } from "lucide-react";
import { Track } from "../../types/track.type";
import { ButtonWithText } from "../common/ButtonWithText";

interface ChatRoomTrackInfoMiniProps {
  track: Track | undefined;
  togglePlaylist: () => void;
}

export default function ChatRoomTrackInfoMini({
  track,
  togglePlaylist,
}: ChatRoomTrackInfoMiniProps) {
  return (
    <div className="fixed flex w-full px-5 py-5 md:hidden">
      <div className="absolute inset-0 z-10 h-28 bg-gradient-to-b from-neutral-900 to-transparent opacity-75 md:hidden"></div>{" "}
      <div className="z-20 flex h-fit w-full items-center justify-between">
        {track ? (
          <div className="flex w-full items-center overflow-hidden">
            {/* 앨범 커버 */}
            <img
              src={track.imageUrl}
              alt={track.title}
              className="h-16 w-16 rounded-md object-cover"
            />

            {/* 음악 정보 */}
            <div className="truncate ml-4 flex flex-col justify-center text-white w-full">
              <p className="truncate text-lg font-bold w-full">{track.title}</p>
              <p className="truncate text-sm text-neutral-100 w-full">
                {track.artist}
              </p>
            </div>
          </div>
        ) : (
          <h1 className="ml-2 flex h-16 items-center truncate text-white">
            재생 중인 곡이 없습니다.
          </h1>
        )}

        <ButtonWithText onClick={togglePlaylist} Icon={ListMusic} text="재생목록" className="text-white" />
      </div>
    </div>
  );
}
