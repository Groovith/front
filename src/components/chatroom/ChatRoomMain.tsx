import ChatRoomHeader from "./ChatRoomHeader";
import { ChatRoomDetailsType, PlayerDetailsDto } from "../../types/types";
import ChatRoomBody from "./ChatRoomBody";
import ChatRoomInput from "./ChatRoomInput";

interface ChatRoomProps {
  chatRoomId: number | null | undefined;
  chatRoomDetails: ChatRoomDetailsType | null;
  playerDetails: PlayerDetailsDto | null;
}

export default function ChatRoomMain({
  chatRoomId,
  chatRoomDetails,
  playerDetails
}: ChatRoomProps) {
  return (
    <div className="flex size-full flex-col border-r">
      <ChatRoomHeader chatRoomDetails={chatRoomDetails} />
      <ChatRoomBody chatRoomId={chatRoomId} playerDetails={playerDetails} />
      <ChatRoomInput chatRoomId={chatRoomId} />
    </div>
  );
}
