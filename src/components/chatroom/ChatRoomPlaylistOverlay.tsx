import { ListPlus, X } from "lucide-react";
import { Button } from "../common/Button";
import { Track } from "../../types/track.type";
import AddTrackModal from "./AddTrackModal";
import { useState } from "react";
import CurrentPlaylistItem from "./CurrentPlaylistItem";

interface ChatRoomPlaylistOverlayProps {
  currentPlaylist: Track[] | undefined;
  currentPlaylistIndex: number | undefined;
  show: boolean;
  togglePlaylist: () => void;
  height?: number;
  isListeningChatRoom: boolean;
}

export default function ChatRoomPlaylistOverlay({
  currentPlaylist,
  currentPlaylistIndex,
  show,
  togglePlaylist,
  height = 0, // 기본값을 0으로 설정
  isListeningChatRoom,
}: ChatRoomPlaylistOverlayProps) {
  const [addTrackModalVisible, setAddTrackModalVisible] = useState(false);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null,
  );
  return (
    <>
      <div
        className={`fixed right-0 z-10 w-full bg-white transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: height }} // 동적으로 높이 설정
      >
        <div className="flex items-center justify-between px-5 py-8">
          <h2 className="text-lg font-semibold">재생목록</h2>
          <div className="flex items-center justify-between gap-2">
            <Button
              variant={"ghost"}
              className="p-1"
              onClick={() => setAddTrackModalVisible(true)}
              disabled={!isListeningChatRoom}
            >
              <ListPlus />
            </Button>
            <AddTrackModal
              addTrackModalVisible={addTrackModalVisible}
              setAddTrackModalVisible={setAddTrackModalVisible}
            />
            <Button
              variant={"ghost"}
              className="p-1"
              onClick={togglePlaylist}
            >
              <X />
            </Button>
          </div>
        </div>
        <div
          className="overflow-y-auto flex flex-col"
          style={{ maxHeight: height - 80 }}
        >
          {currentPlaylist?.map((track, index) => (
            <CurrentPlaylistItem
              key={index}
              track={track}
              index={index}
              isCurrentTrack={index === currentPlaylistIndex}
              isHovered={index === hoveredTrackIndex}
              setHoveredTrackIndex={setHoveredTrackIndex}
            />
          ))}
        </div>
      </div>
    </>
  );
}
