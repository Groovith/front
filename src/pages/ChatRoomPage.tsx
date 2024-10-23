import { useParams } from "react-router-dom";
import ChatRoom from "../components/chatroom/ChatRoom";

export default function ChatRoomPage() {
  const { chatRoomId } = useParams();

  if (typeof chatRoomId === 'undefined') {
    return <>잘못된 접근입니다.</>;
  }

  const chatRoomIdNumber = Number(chatRoomId);

  // chatRoomId가 number가 아닌 경우를 처리
  if (isNaN(chatRoomIdNumber)) {
    return <>잘못된 채팅방 ID입니다.</>;
  }

  return (
    <>
      <ChatRoom chatRoomId={chatRoomIdNumber} />
    </>
  );
}
