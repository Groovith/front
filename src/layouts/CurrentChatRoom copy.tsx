import { useChatRoomStore } from "../stores/useChatRoomStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePlayer } from "../hooks/usePlayer";
import { useState } from "react";
import ChatRoomPlaylist from "../components/chatroom/ChatRoomPlaylist";
import ChatRoom from "../components/chatroom/ChatRoomMain";
import ChatRoomTrackInfo from "../components/chatroom/ChatRoomTrackInfo";

export default function CurrentChatRoom() {
  const { isCurrentChatRoomOpen } = useChatRoomStore();
  const { seek, resumePlayer, pausePlayer } = usePlayer();
  const {
    duration,
    position,
    paused,
    setPosition,
    currentPlaylist,
    currentPlaylistIndex,
  } = usePlayerStore();
  const [newPosition, setNewPosition] = useState<number>();
  const { isListenTogetherConnected, listenTogetherId } = usePlayerStore();

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    seek(newPosition);
  };

  return (
    <div
      className={`absolute z-40 flex h-full w-full items-center justify-center bg-white transition-transform duration-300 ${
        isCurrentChatRoomOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex size-full flex-col border-r">
        {isListenTogetherConnected ? (
          <ChatRoom chatRoomId={String(listenTogetherId)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            현재 참여 중인 채팅방이 없습니다.
          </div>
        )}
      </div>
      <div className="flex size-full max-w-[500px] flex-col">
        <ChatRoomTrackInfo track={undefined} position={0} paused={false} />
        <ChatRoomPlaylist
          currentPlaylist={currentPlaylist} // playlist 전달
          currentPlaylistIndex={currentPlaylistIndex} // 현재 재생 중인 인덱스 전달
        />
      </div>
    </div>
  );
}
