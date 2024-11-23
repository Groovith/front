import { Track } from "../../types/track.type";

interface ChatRoomTrackInfoProps {
  track: Track | undefined;
}

export default function ChatRoomTrackInfo({ track }: ChatRoomTrackInfoProps) {
  if (!track) {
    return (
      <div className="flex size-full flex-1 items-center justify-center border-b text-sm text-neutral-400">
        재생 중인 곡이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center border-b p-5">
      <div className="flex w-full max-w-[300px] flex-none flex-col gap-5 truncate">
        <div className="relative w-full pb-[100%]">
          <img
            src={track.imageUrl}
            className="absolute inset-0 size-full rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="truncate text-2xl font-semibold text-neutral-900">
            {track.title}
          </p>
          <p className="text-lg text-neutral-500">{track.artist}</p>
        </div>
      </div>
    </div>
  );
}
