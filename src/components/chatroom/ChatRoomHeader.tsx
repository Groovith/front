import { ArrowLeft, Menu, UserPlus } from "lucide-react";
import { ChatRoomDetailsType } from "../../types/types";
import { Button } from "../Button";
import DropdownButton from "../DropdownButton";
import { leaveChatRoom } from "../../utils/apis/serverAPI";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

interface ChatRoomHeaderProps {
  chatRoomDetails: ChatRoomDetailsType;
}

export default function ChatRoomHeader({
  chatRoomDetails,
}: ChatRoomHeaderProps) {
  const navigate = useNavigate();
  const handleLeaveChatRoom = async (chatRoomId: number) => {
    try {
      await leaveChatRoom(chatRoomId);
    } catch (e) {
      console.error("채팅방 나가기 중 오류 발생: ", e);
      toast.error("채팅방 나가기 중 오류가 발생하였습니다.");
    }
  };

  return (
    <div className="flex h-[80px] items-center justify-between border-b px-2">
      <div className="flex items-center">
        <Button variant={"ghost"} className="p-2 mr-2" onClick={() => navigate("/chat")}>
          <ArrowLeft />
        </Button>
        <img
          src={chatRoomDetails.imageUrl}
          className="mr-5 size-12 rounded-full"
        ></img>
        <h1>{chatRoomDetails?.name}</h1>
      </div>
      <div className="flex">
        <Button variant={"ghost"}>
          <UserPlus />
        </Button>
        <DropdownButton
          items={[
            {
              label: "채팅방 나가기",
              action: () => {
                handleLeaveChatRoom(chatRoomDetails.chatRoomId);
              },
            },
          ]}
        >
          <Button variant={"ghost"}>
            <Menu />
          </Button>
        </DropdownButton>
      </div>
    </div>
  );
}
