import { EllipsisVertical, LogOut } from "lucide-react";
import DropdownButton from "../common/DropdownButton";
import { Button } from "../common/Button";
import { ChatRoomDetailsType } from "../../types/types";

interface ChatRoomListItemProps {
  chatRoom: ChatRoomDetailsType;
  handleChatRoomClick: (chatRoomId: number) => void;
  leaveChatRoomMutate: (chatRoomId: number) => void;
}

export default function ChatRoomListItem({
  chatRoom,
  handleChatRoomClick,
  leaveChatRoomMutate,
}: ChatRoomListItemProps) {
  return (
    <li
      key={chatRoom.chatRoomId}
      className="group px-3 flex w-full items-center justify-between py-4 text-left hover:bg-neutral-100 rounded-xl"
    >
      <div
        className="flex items-center gap-5 hover:cursor-pointer"
        onClick={() => handleChatRoomClick(chatRoom.chatRoomId)}
      >
        <img src={chatRoom.imageUrl} className="size-12 rounded-full" />
        <div className="flex flex-col">
          <h2 className="text-neutral-900">{chatRoom.name}</h2>
          <p className="text-sm text-neutral-400">{chatRoom.masterUserName ? "@" + chatRoom.masterUserName : "@알 수 없음"}</p>
        </div>
      </div>

      <DropdownButton
        items={[
          {
            label: "채팅방 나가기",
            action: () => leaveChatRoomMutate(chatRoom.chatRoomId),
            Icon: LogOut,
          },
        ]}
      >
        <Button
          variant={"transparent"}
          className="p-0 md:opacity-0 group-hover:opacity-100"
        >
          <EllipsisVertical />
        </Button>
      </DropdownButton>
    </li>
  );
}
