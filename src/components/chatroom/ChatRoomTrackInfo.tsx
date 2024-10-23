import {
  Repeat,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Shuffle,
} from "lucide-react";
import { Track } from "../../types/track.type";
import { formatDuration } from "../../utils/formatDuration";
import { Button } from "../Button";

interface ChatRoomTrackInfoProps {
  track: Track | undefined;
  position: number;
  paused: boolean;
}

export default function ChatRoomTrackInfo({
  track,
  position,
  paused,
}: ChatRoomTrackInfoProps) {
  
  if (!track) {
    return (
      <div className="flex size-full flex-1 items-center justify-center border-b text-sm text-neutral-400">
        재생 중인 곡이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center border-b p-5">
      <div className="flex max-w-[300px] flex-none flex-col gap-5 truncate">
        <img src={track.imageUrl} className="w-full rounded-lg object-cover" />
        <div className="flex flex-col gap-1">
          <p className="truncate text-2xl font-semibold text-neutral-900">
            {track.title}
          </p>
          <p className="text-lg text-neutral-500">{track.artist}</p>
        </div>
        <div className="relative flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-400">{formatDuration(position)}</p>
          <input
            className="h-0.5 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
            type="range"
            min="0"
            max={track.duration}
            value={position}
            onChange={() => {}}
            style={{
              background: `linear-gradient(to right, #FF6735 ${(position / track.duration) * 100}%)`,
            }}
          />
          <p className="text-sm text-neutral-400">
            {formatDuration(track.duration)}
          </p>
        </div>
        <div className="hidden w-full justify-between md:flex">
          <Button variant={"transparent"}>
            <Repeat size={18} />
          </Button>
          <Button variant={"transparent"} className="text-neutral-600">
            <SkipBack />
          </Button>
          {paused ? (
            <Button className="rounded-full p-3" onClick={() => {}}>
              <Play size={30} />
            </Button>
          ) : (
            <Button className="rounded-full p-3" onClick={() => {}}>
              <Pause size={30} />
            </Button>
          )}
          <Button variant={"transparent"} className="text-neutral-600">
            <SkipForward />
          </Button>
          <Button variant={"transparent"}>
            <Shuffle size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
