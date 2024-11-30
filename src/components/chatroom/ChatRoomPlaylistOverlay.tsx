import { ListPlus, X } from "lucide-react";
import { Button } from "../common/Button";
import { Track } from "../../types/track.type";
import AddTrackModal from "./AddTrackModal";
import { useState } from "react";
import CurrentPlaylistItem from "./CurrentPlaylistItem";
import { toast } from "sonner";
import { ButtonWithText } from "../common/ButtonWithText";
import { ChatRoomDetailsType } from "../../types/types";

interface ChatRoomPlaylistOverlayProps {
  currentPlaylist: Track[] | undefined;
  currentPlaylistIndex: number | undefined;
  show: boolean;
  togglePlaylist: () => void;
  height?: number;
  isListeningChatRoom: boolean;
  chatRoomDetails: ChatRoomDetailsType | undefined;
}

export default function ChatRoomPlaylistOverlay({
  currentPlaylist,
  currentPlaylistIndex,
  show,
  togglePlaylist,
  height = 0, // 기본값을 0으로 설정
  isListeningChatRoom,
  chatRoomDetails,
}: ChatRoomPlaylistOverlayProps) {
  const [addTrackModalVisible, setAddTrackModalVisible] = useState(false);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null,
  );

  const handleAddTrackClick = () => {
    if (!isListeningChatRoom) {
      toast.message("음악을 추가하려면 같이 듣기에 참여해주세요.");
      return;
    } else if (
      chatRoomDetails &&
      chatRoomDetails.permission == "MASTER" &&
      !chatRoomDetails.isMaster
    ) {
      toast.message("해당 채팅방은 방장만 조작 가능합니다.");
      return;
    }
    setAddTrackModalVisible(true);
  };

  return (
    <>
      <div
        className={`fixed right-0 z-10 w-full overflow-hidden bg-white transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: height }} // 동적으로 높이 설정
      >
        <div className="flex w-full items-center p-5">
          <div className="flex w-full h-10 items-center justify-between">
            <h2 className="text-lg font-semibold">재생목록</h2>
            <div className="flex items-center justify-between gap-2">
              <ButtonWithText
                onClick={handleAddTrackClick}
                Icon={ListPlus}
                text="추가"
              />
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
        </div>
        <div
          className="flex flex-col overflow-y-auto pb-20"
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
