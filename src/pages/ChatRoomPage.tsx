import { useParams } from "react-router-dom";
import ChatRoom from "../components/chatroom/ChatRoom";
import ChatRoomPlayer from "../components/chatroom/ChatRoomPlayer";

export default function ChatRoomPage() {
  const { chatRoomId } = useParams();

  return (
    <div className="flex size-full">
      <ChatRoom chatRoomId={chatRoomId} />
      <div className="hidden w-full max-w-[400px] md:flex">
        <ChatRoomPlayer currentPlaylist={[]} currentPlaylistIndex={0} />
      </div>
    </div>
  );
}
