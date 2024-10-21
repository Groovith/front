import { useParams } from "react-router-dom";
import ChatRoom from "../components/chatroom/ChatRoom";
import ChatRoomPlayer from "../components/chatroom/ChatRoomPlayer";

export default function ChatRoomPage() {
  const { chatRoomId } = useParams();

  return (
    <div className="flex size-full">
      <ChatRoom chatRoomId={chatRoomId} />
      <div className="hidden md:flex max-w-[400px] w-full">
        <ChatRoomPlayer />
      </div>
    </div>
  );
}
