import { LogOut, Menu, Settings, Trash2, UserPlus } from "lucide-react";
import { Button } from "../common/Button";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { toast } from "sonner";
import { leaveChatRoom } from "../../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChatRoomSettingsModal from "./ChatRoomSettingsModal";
import { ChatRoomDetailsType } from "../../types/types";
import DeleteChatRoomWarningModal from "../chat/DeleteChatRoomWarningModal";
import { deleteChatRoom } from "../../utils/apis/chatroom/deleteChatRoom.api";

interface ChatRoomHeaderDropdownButtonProps {
  chatRoomDetails: ChatRoomDetailsType | undefined;
  openInvitationModal: () => void;
  refetch: () => void;
}

export default function ChatRoomHeaderDropdownButton({
  chatRoomDetails,
  openInvitationModal,
  refetch,
}: ChatRoomHeaderDropdownButtonProps) {
  const navigate = useNavigate();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isDeleteChatRoomModalOpen, setDeleteChatRoomModalOpen] =
    useState(false);

  const handleLeaveChatRoom = async () => {
    if (chatRoomDetails === undefined) return;

    try {
      await leaveChatRoom(chatRoomDetails.chatRoomId);
      navigate("/chat");
    } catch (e) {
      console.error("채팅방 나가기 중 오류 발생: ", e);
      toast.error("채팅방 나가기 중 오류가 발생하였습니다.");
    }
  };

  // isMaster가 true일 경우의 항목
  const masterItems: DropdownItem[] = [
    {
      Icon: UserPlus,
      label: "채팅방에 초대",
      action: openInvitationModal,
    },
    {
      Icon: Settings,
      label: "채팅방 설정",
      action: () => setSettingsModalOpen(true),
    },
    {
      Icon: Trash2,
      label: "채팅방 삭제",
      action: () => setDeleteChatRoomModalOpen(true),
      color: "red",
    },
  ];

  // isMaster가 false일 경우의 항목
  const userItems: DropdownItem[] = [
    {
      Icon: UserPlus,
      label: "채팅방에 초대",
      action: openInvitationModal,
    },
    {
      Icon: LogOut,
      label: "채팅방 나가기",
      action: handleLeaveChatRoom,
    },
  ];

  // isMaster에 따라 표시할 항목 선택
  const items = chatRoomDetails?.isMaster ? masterItems : userItems;

  const handleDeleteChatRoom = async () => {
    if (chatRoomDetails == undefined) return;

    try {
      await deleteChatRoom(chatRoomDetails.chatRoomId);
      setDeleteChatRoomModalOpen(false);
      navigate("/chat");
      toast.message("채팅방이 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      toast.error("채팅방 삭제 중 오류가 발생하였습니다.");
    }
  };

  return (
    <>
      <DropdownButton items={items}>
        <Button variant={"ghost"}>
          <Menu />
        </Button>
      </DropdownButton>
      {isSettingsModalOpen && chatRoomDetails && (
        <ChatRoomSettingsModal
          chatRoomDetails={chatRoomDetails}
          onClose={() => setSettingsModalOpen(false)}
          refetch={refetch}
        />
      )}
      {isDeleteChatRoomModalOpen && (
        <DeleteChatRoomWarningModal
          onClose={() => setDeleteChatRoomModalOpen(false)}
          handleDeleteChatRoom={handleDeleteChatRoom}
        />
      )}
    </>
  );
}
