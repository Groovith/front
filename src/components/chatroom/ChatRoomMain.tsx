import ChatRoomHeader from "./ChatRoomHeader";
import { ChatRoomDetailsType } from "../../types/types";
import ChatRoomBody from "./ChatRoomBody";
import ChatRoomInput from "./ChatRoomInput";

interface ChatRoomProps {
  chatRoomId: number | null | undefined;
  chatRoomDetails: ChatRoomDetailsType | null;
}

export default function ChatRoomMain({
  chatRoomId,
  chatRoomDetails,
}: ChatRoomProps) {
  return (
    <div className="flex size-full flex-col border-r">
      <ChatRoomHeader chatRoomDetails={chatRoomDetails} />
      <ChatRoomBody chatRoomId={chatRoomId} />
      <ChatRoomInput chatRoomId={chatRoomId} />
    </div>
  );
}
