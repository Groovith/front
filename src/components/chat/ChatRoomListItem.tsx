import { EllipsisVertical, LogOut, Trash2 } from "lucide-react";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { Button } from "../common/Button";
import { ChatRoomDetailsType } from "../../types/types";
import { useUserStore } from "../../stores/useUserStore";

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
  const { userId } = useUserStore();
  const leaveChatRoomButton: DropdownItem = {
    Icon: LogOut,
    label: "채팅방 나가기",
    action: () => leaveChatRoomMutate(chatRoom.chatRoomId),
  };

  const deleteChatRoomButton: DropdownItem = {
    Icon: Trash2,
    label: "채팅방 삭제",
    action: () => {},
    color: "red",
  };

  const dropdownItems =
    chatRoom.masterUserId === userId
      ? [deleteChatRoomButton]
      : [leaveChatRoomButton];

  return (
    <li
      key={chatRoom.chatRoomId}
      className="group flex w-full items-center justify-between rounded-xl px-3 py-4 text-left hover:bg-neutral-100"
    >
      <div
        className="flex items-center gap-5 hover:cursor-pointer"
        onClick={() => handleChatRoomClick(chatRoom.chatRoomId)}
      >
        <img src={chatRoom.imageUrl} className="size-12 rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-400">
            <p className="text-sm">
              {chatRoom.masterUserName ? chatRoom.masterUserName : "알 수 없음"}
            </p>
          </div>
          <h2 className="text-neutral-900">{chatRoom.name}</h2>
        </div>
      </div>

      <DropdownButton items={dropdownItems}>
        <Button
          variant={"transparent"}
          className="p-0 group-hover:opacity-100 md:opacity-0"
        >
          <EllipsisVertical />
        </Button>
      </DropdownButton>
    </li>
  );
}
