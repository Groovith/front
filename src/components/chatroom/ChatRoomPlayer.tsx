import { usePlayerStore } from "../../stores/usePlayerStore";
import { ChatRoomDetailsType, PlayerDetailsDto } from "../../types/types";
import ChatRoomPlaylist from "./ChatRoomPlaylist";
import ChatRoomTrackInfo from "./ChatRoomTrackInfo";

interface ChatRoomPlayerProps {
  playerDetails: PlayerDetailsDto | null;
  chatRoomDetails: ChatRoomDetailsType | undefined;
}

export default function ChatRoomPlayer({
  playerDetails,
  chatRoomDetails,
}: ChatRoomPlayerProps) {
  const { currentPlaylist, currentPlaylistIndex, listenTogetherId } =
    usePlayerStore();
  const isListeningChatRoom =
    !playerDetails || playerDetails.chatRoomId === listenTogetherId;
  if (!playerDetails) {
    return (
      <div className="flex size-full flex-col">
        <ChatRoomTrackInfo track={currentPlaylist[currentPlaylistIndex]} />
        <ChatRoomPlaylist
          currentPlaylist={currentPlaylist}
          currentPlaylistIndex={currentPlaylistIndex}
          isListeningChatRoom={isListeningChatRoom}
          chatRoomDetails={chatRoomDetails}
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
        chatRoomDetails={chatRoomDetails}
      />
    </div>
  );
}
