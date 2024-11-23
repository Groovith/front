import { AudioLines } from "lucide-react";
import { Track } from "../../types/track.type";
import { formatDurationSec } from "../../utils/formatDurationSec";

interface ChatRoomDetailsPlaylistItemProps {
  track: Track;
  index: number;
  isCurrentTrack: boolean;
}

export default function ChatRoomDetailsPlaylistItem({
  track,
  index,
  isCurrentTrack,
}: ChatRoomDetailsPlaylistItemProps) {
  return (
    <div
      key={index}
      className={`flex h-fit w-full flex-none items-center justify-between border-b px-4 py-2 hover:bg-neutral-100 ${
        isCurrentTrack ? "bg-neutral-100" : ""
      }`}
    >
      <div className="flex w-full gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
        <div className="relative flex size-14 flex-none rounded-sm">
          <img
            src={track.imageUrl}
            className="h-full rounded-md object-cover"
            alt="Album Art"
          />
          {isCurrentTrack && (
            <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black bg-opacity-50">
              <AudioLines className="text-white" />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <p className="w-full truncate text-neutral-900">
            {track.title}
          </p>
          <p className="w-full truncate text-sm text-neutral-500">
            {track.artist}
          </p>
        </div>
      </div>
      <div className="w-fit items-center justify-center gap-1">
        <p className="text-neutral-500">{formatDurationSec(track.duration)}</p>
      </div>
    </div>
  );
}
