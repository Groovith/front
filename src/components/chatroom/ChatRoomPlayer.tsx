import { usePlayerStore } from "../../stores/usePlayerStore";
import { PlayerDetailsDto } from "../../types/types";
import ChatRoomPlaylist from "./ChatRoomPlaylist";
import ChatRoomTrackInfo from "./ChatRoomTrackInfo";

interface ChatRoomPlayerProps {
  playerDetails: PlayerDetailsDto | null;
}

export default function ChatRoomPlayer({ playerDetails }: ChatRoomPlayerProps) {
  const { listenTogetherId } = usePlayerStore();
  const isListeningChatRoom = typeof playerDetails?.chatRoomId == 'undefined' ? true : playerDetails.chatRoomId === listenTogetherId;
  if (!playerDetails) {
    const { currentPlaylist, currentPlaylistIndex } = usePlayerStore();
    return (
      <div className="flex size-full flex-col">
        <ChatRoomTrackInfo track={currentPlaylist[currentPlaylistIndex]} />
        <ChatRoomPlaylist
          currentPlaylist={currentPlaylist}
          currentPlaylistIndex={currentPlaylistIndex}
          isListeningChatRoom={isListeningChatRoom}
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
      />
      <ChatRoomPlaylist
        currentPlaylist={playerDetails.currentPlaylist}
        currentPlaylistIndex={playerDetails.currentPlaylistIndex}
        isListeningChatRoom={isListeningChatRoom}
      />
    </div>
  );
}
