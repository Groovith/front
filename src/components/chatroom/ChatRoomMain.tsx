import ChatRoomHeader from "./ChatRoomHeader";
import { ChatRoomDetailsType, PlayerDetailsDto } from "../../types/types";
import ChatRoomBody from "./ChatRoomBody";
import ChatRoomInput from "./ChatRoomInput";

interface ChatRoomProps {
  chatRoomId: number | null | undefined;
  chatRoomDetails: ChatRoomDetailsType | undefined;
  refetchChatRoom: () => {};
  playerDetails: PlayerDetailsDto | null;
}

export default function ChatRoomMain({
  chatRoomId,
  chatRoomDetails,
  playerDetails,
  refetchChatRoom
}: ChatRoomProps) {
  return (
    <div className="flex size-full flex-col border-r">
      <ChatRoomHeader chatRoomDetails={chatRoomDetails} refetchChatRoom={refetchChatRoom} />
      <ChatRoomBody chatRoomId={chatRoomId} playerDetails={playerDetails} chatRoomDetails={chatRoomDetails} />
      <ChatRoomInput chatRoomId={chatRoomId} />
    </div>
  );
}
