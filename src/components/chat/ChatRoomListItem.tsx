import { EllipsisVertical, LogOut, Trash2 } from "lucide-react";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { Button } from "../common/Button";
import { ChatRoomDetailsType } from "../../types/types";
import { deleteChatRoom } from "../../utils/apis/chatroom/deleteChatRoom.api";
import { toast } from "sonner";
import { useState } from "react";
import DeleteChatRoomWarningModal from "./DeleteChatRoomWarningModal";

interface ChatRoomListItemProps {
  chatRoom: ChatRoomDetailsType;
  handleChatRoomClick: (chatRoomId: number) => void;
  leaveChatRoomMutate: (chatRoomId: number) => void;
  refetch: () => void;
}

export default function ChatRoomListItem({
  chatRoom,
  handleChatRoomClick,
  leaveChatRoomMutate,
  refetch
}: ChatRoomListItemProps) {
  const [isDeleteChatRoomModalOpen, setDeleteChatRoomModalOpen] =
    useState(false);
  const leaveChatRoomButton: DropdownItem = {
    Icon: LogOut,
    label: "채팅방 나가기",
    action: () => leaveChatRoomMutate(chatRoom.chatRoomId),
  };

  const deleteChatRoomButton: DropdownItem = {
    Icon: Trash2,
    label: "채팅방 삭제",
    action: () => {
      setDeleteChatRoomModalOpen(true);
    },
    color: "red",
  };

  const handleDeleteChatRoom = async () => {
    try {
      await deleteChatRoom(chatRoom.chatRoomId);
      refetch();
      setDeleteChatRoomModalOpen(false);
      toast.message("채팅방이 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      toast.error("채팅방 삭제 중 오류가 발생하였습니다.");
    }
  };

  const dropdownItems = chatRoom.isMaster
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
        <img src={chatRoom.imageUrl} className="size-12 rounded-full object-cover" />
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

      {isDeleteChatRoomModalOpen && (
        <DeleteChatRoomWarningModal
          onClose={() => setDeleteChatRoomModalOpen(false)}
          handleDeleteChatRoom={handleDeleteChatRoom}
        />
      )}
    </li>
  );
}
