import {
  AudioLines,
  EllipsisVertical,
  ListMusic,
  ListPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import DropdownButton from "./DropdownButton";
import { formatDuation } from "../utils/formatDuration";
import { Modal } from "./Modal";
import getVideoId from "get-video-id";
import { toast, Toaster } from "sonner";

// CurrentPlaylist 컴포넌트에 필요한 props 정의
interface CurrentPlaylistProps {
  playlist: Array<string>; // playlist 데이터 타입을 정의할 수 있습니다.
  currentPlaylistIndex: number;
  onPlayAtIndex: (index: number) => void;
  onRemoveFromPlaylist: (index: number) => void;
  addToCurrentPlaylist: (videoId: string) => void;
}

export default function CurrentPlaylist({
  playlist,
  currentPlaylistIndex,
  onPlayAtIndex,
  onRemoveFromPlaylist,
  addToCurrentPlaylist,
}: CurrentPlaylistProps) {
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null,
  );
  const [addTrackModalVisible, setAddTrackModalVisible] = useState(false);
  const [youTubeUrl, setYouTubeUrl] = useState("");

  const handleAddTrack = () => {
    const videoId = getVideoId(youTubeUrl);
    if (!videoId.id || videoId.service !== "youtube") {
      toast.error("잘못된 URL 형식입니다.");
    } else {
      toast("곡을 추가하였습니다.");
      addToCurrentPlaylist(videoId.id);
      setAddTrackModalVisible(false);
      setYouTubeUrl("");
    }
  };

  return (
    <div className="flex size-full flex-1 flex-col overflow-y-auto">
      <Toaster richColors position="bottom-center" />
      {addTrackModalVisible && (
        <Modal
          onClose={() => setAddTrackModalVisible(false)}
          closeOnOutsideClick={true}
        >
          <div className="flex flex-col">
            <div className="mb-10 flex items-center justify-between">
              <h1 className="text-2xl font-bold">음악 추가</h1>
              <Button
                variant={"transparent"}
                onClick={() => setAddTrackModalVisible(false)}
                className="p-0"
              >
                <X />
              </Button>
            </div>
            <p className="mb-5 text-neutral-600">
              유튜브 링크를 입력하여 음악을 추가하세요.
            </p>
            <div className="flex flex-col gap-5">
              <input
                type="text"
                className="rounded-xl border p-3"
                placeholder="https://..."
                value={youTubeUrl}
                onChange={(e) => setYouTubeUrl(e.target.value)}
              />
              <Button onClick={handleAddTrack}>추가하기</Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex w-full items-center justify-between border-b border-neutral-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <ListMusic />
          <p>재생목록</p>
        </div>
        <div className="flex items-center">
          <Button
            variant={"transparent"}
            onClick={() => setAddTrackModalVisible(true)}
          >
            <ListPlus />
          </Button>
        </div>
      </div>
      {playlist &&
        playlist.map((track, index) => (
          <div
            key={index}
            className={`flex h-[65px] w-full flex-none items-center justify-between border-b px-4 py-2 hover:bg-neutral-100 ${
              index === currentPlaylistIndex ? "bg-neutral-100" : ""
            }`}
            onMouseEnter={() => setHoveredTrackIndex(index)}
            onMouseLeave={() => setHoveredTrackIndex(null)}
          >
            <div className="flex w-full gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
              <div
                className="relative flex size-14 flex-none rounded-sm hover:cursor-pointer"
                onClick={() => onPlayAtIndex(index)}
              >
                <img
                  className="h-full rounded-sm object-cover"
                  alt="Album Art"
                />
                {index === -1 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black bg-opacity-50">
                    <AudioLines className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex w-full flex-col gap-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                <p
                  className="w-fit overflow-hidden text-ellipsis whitespace-nowrap text-neutral-900 hover:cursor-pointer"
                  onClick={() => onPlayAtIndex(index)}
                >
                  {track}
                </p>
                <p className="text-sm text-neutral-500">
                  {"Artist"}
                </p>
              </div>
            </div>
            <div className="flex w-10 items-center justify-center gap-1">
              {index === hoveredTrackIndex ? (
                <DropdownButton
                  items={[
                    {
                      label: "현재 재생목록에서 삭제",
                      action: () => {
                        onRemoveFromPlaylist(index);
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
                <p className="text-neutral-500">
                  {formatDuation(0)}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
