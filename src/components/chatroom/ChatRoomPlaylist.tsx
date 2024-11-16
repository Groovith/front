import { ListMusic, ListPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../common/Button";
import { Track } from "../../types/track.type";
import CurrentPlaylistItem from "./CurrentPlaylistItem";
import AddTrackModal from "./AddTrackModal";

// CurrentPlaylist 컴포넌트에 필요한 props 정의
interface ChatRoomPlaylistProps {
  currentPlaylist: Track[]; // playlist 데이터 타입을 정의할 수 있습니다.
  currentPlaylistIndex: number;
}

export default function ChatRoomPlaylist({
  currentPlaylist,
  currentPlaylistIndex,
}: ChatRoomPlaylistProps) {
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null,
  );
  const [addTrackModalVisible, setAddTrackModalVisible] = useState(false);

  useEffect(() => {
    if (addTrackModalVisible) {
      document.getElementById("youtube-url-input")?.focus();
    }
  }, [addTrackModalVisible]);

  return (
    <div className="flex size-full flex-1 flex-col overflow-y-auto">
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
          <AddTrackModal
            addTrackModalVisible={addTrackModalVisible}
            setAddTrackModalVisible={setAddTrackModalVisible}
          />
        </div>
      </div>
      {currentPlaylist &&
        currentPlaylist.map((track, index) => (
          <CurrentPlaylistItem
            key={index}
            track={track}
            index={index}
            isCurrentTrack={index == currentPlaylistIndex}
            isHovered={index == hoveredTrackIndex}
            setHoveredTrackIndex={setHoveredTrackIndex}
          />
        ))}
    </div>
  );
}
