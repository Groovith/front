import { Track } from "../../types/track.type";
import ChatRoomPlaylist from "./ChatRoomPlaylist";
import ChatRoomTrackInfo from "./ChatRoomTrackInfo";

interface ChatRoomPlayerProps {
  currentPlaylist: Track[];
  currentPlaylistIndex: number;
}

export default function ChatRoomPlayer({
  currentPlaylist,
  currentPlaylistIndex,
}: ChatRoomPlayerProps) {
  return (
    <div className="flex size-full flex-col">
      <ChatRoomTrackInfo
        track={currentPlaylist[currentPlaylistIndex]}
        position={0}
        paused={false}
      />
      <ChatRoomPlaylist
        currentPlaylist={currentPlaylist}
        currentPlaylistIndex={0}
      />
    </div>
  );
}
