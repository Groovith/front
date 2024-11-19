import { LogOut, Menu, Settings, UserPlus } from "lucide-react";
import { Button } from "../common/Button";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { toast } from "sonner";
import { leaveChatRoom } from "../../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChatRoomSettingsModal from "./ChatRoomSettingsModal";
import { ChatRoomDetailsType } from "../../types/types";

interface ChatRoomHeaderDropdownButtonProps {
  chatRoomDetails: ChatRoomDetailsType | undefined;
  openInvitationModal: () => void;
  refetch: () => void;
}

export default function ChatRoomHeaderDropdownButton({
  chatRoomDetails,
  openInvitationModal,
  refetch
}: ChatRoomHeaderDropdownButtonProps) {
  const navigate = useNavigate();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

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

  const items: DropdownItem[] = [
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
      Icon: LogOut,
      label: "채팅방 나가기",
      action: handleLeaveChatRoom,
    },
  ];

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
    </>
  );
}
