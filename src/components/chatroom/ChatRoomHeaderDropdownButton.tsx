import { LogOut, Menu, Settings, UserPlus } from "lucide-react";
import { Button } from "../common/Button";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { toast } from "sonner";
import { leaveChatRoom } from "../../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";

interface ChatRoomHeaderDropdownButtonProps {
  chatRoomId: number | undefined;
}

export default function ChatRoomHeaderDropdownButton({
  chatRoomId,
}: ChatRoomHeaderDropdownButtonProps) {
  const navigate = useNavigate();

  const handleInvite = async () => {};

  const handleChangeSettings = async () => {};

  const handleLeaveChatRoom = async () => {
    if (chatRoomId === undefined) return;

    try {
      await leaveChatRoom(chatRoomId);
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
      action: handleInvite,
    },
    {
        Icon: Settings,
        label: "채팅방 설정 변경",
        action: handleChangeSettings,
      },
    {
      Icon: LogOut,
      label: "채팅방 나가기",
      action: handleLeaveChatRoom,
    },
  ];

  return (
    <DropdownButton items={items}>
      <Button variant={"ghost"}>
        <Menu />
      </Button>
    </DropdownButton>
  );
}
