import { usePlayerStore } from "../../stores/usePlayerStore";
import { PlayerDetailsDto } from "../../types/types";
import ChatRoomPlaylist from "./ChatRoomPlaylist";
import ChatRoomTrackInfo from "./ChatRoomTrackInfo";

interface ChatRoomPlayerProps {
  playerDetails: PlayerDetailsDto | null;
}

export default function ChatRoomPlayer({ playerDetails }: ChatRoomPlayerProps) {
  if (!playerDetails) {
    const { currentPlaylist, currentPlaylistIndex, position, paused } = usePlayerStore();
    return (
      <div className="flex size-full flex-col">
        <ChatRoomTrackInfo
          track={currentPlaylist[currentPlaylistIndex]}
          position={position}
          paused={paused}
        />
        <ChatRoomPlaylist
          currentPlaylist={currentPlaylist}
          currentPlaylistIndex={currentPlaylistIndex}
        />
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col">
      <ChatRoomTrackInfo
        track={
          playerDetails.currentPlaylist[playerDetails.currentPlaylistIndex]
        }
        position={0}
        paused={false}
      />
      <ChatRoomPlaylist
        currentPlaylist={playerDetails.currentPlaylist}
        currentPlaylistIndex={0}
      />
    </div>
  );
}
