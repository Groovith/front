import { useEffect, useState } from "react";
import ChatRoom from "../components/chatroom/ChatRoom";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function CurrentChatRoom() {
  const { isCurrentChatRoomOpen } = useChatRoomStore();
  const { listenTogetherId } = usePlayerStore();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [listenTogetherId])

  return (
    <div
      className={`absolute z-40 flex h-full w-full items-center justify-center bg-white transition-transform duration-300 ${
        isCurrentChatRoomOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <ChatRoom chatRoomId={listenTogetherId} key={key}/>
    </div>
  );
}
