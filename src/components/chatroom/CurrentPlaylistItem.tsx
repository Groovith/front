import { AudioLines, EllipsisVertical, Trash2 } from "lucide-react";
import { usePlayer } from "../../hooks/usePlayer";
import { Track } from "../../types/track.type";
import { Button } from "../common/Button";
import DropdownButton from "../common/DropdownButton";
import { formatDurationSec } from "../../utils/formatDurationSec";

interface CurrentPlaylistItemProps {
  track: Track;
  index: number;
  isCurrentTrack: boolean;
  isHovered: boolean;
  setHoveredTrackIndex: (v: number | null) => void;
}

export default function CurrentPlaylistItem({
  track,
  index,
  isCurrentTrack,
  isHovered,
  setHoveredTrackIndex,
}: CurrentPlaylistItemProps) {
  const { playAtIndex, removeFromCurrentPlaylist } = usePlayer();
  return (
    <div
      key={index}
      className={`flex h-[65px] w-full flex-none items-center justify-between border-b px-4 py-2 hover:bg-neutral-100 ${
        isCurrentTrack ? "bg-neutral-100" : ""
      }`}
      onMouseEnter={() => setHoveredTrackIndex(index)}
      onMouseLeave={() => setHoveredTrackIndex(null)}
    >
      <div className="flex w-full gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
        <div
          className="relative flex size-14 flex-none rounded-sm hover:cursor-pointer"
          onClick={() => playAtIndex(index)}
        >
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
          <p
            className="w-fit overflow-hidden text-ellipsis whitespace-nowrap text-neutral-900 hover:cursor-pointer"
            onClick={() => playAtIndex(index)}
          >
            {track.title}
          </p>
          <p className="text-sm text-neutral-500">{track.artist}</p>
        </div>
      </div>
      <div className="hidden w-10 items-center justify-center gap-1 md:flex">
        {isHovered ? (
          <DropdownButton
            items={[
              {
                Icon: Trash2,
                label: "현재 재생목록에서 삭제",
                action: () => {
                  removeFromCurrentPlaylist(index);
                },
              },
            ]}
          >
            <Button
              variant={"ghost"}
              className="rounded-full p-3 hover:bg-neutral-300"
            >
              <EllipsisVertical />
            </Button>
          </DropdownButton>
        ) : (
          <p className="text-neutral-500">{formatDurationSec(track.duration)}</p>
        )}
      </div>
      <div className="flex w-10 items-center justify-center gap-1 md:hidden">
        <DropdownButton
          items={[
            {
              label: "현재 재생목록에서 삭제",
              action: () => {
                removeFromCurrentPlaylist(index);
              },
            },
          ]}
        >
          <Button
            variant={"ghost"}
            className="rounded-full p-3 hover:bg-neutral-300"
          >
            <EllipsisVertical />
          </Button>
        </DropdownButton>
      </div>
    </div>
  );
}
