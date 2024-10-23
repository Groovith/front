import { ArrowLeft, Menu, UserPlus } from "lucide-react";
import { ChatRoomDetailsType } from "../../types/types";
import { Button } from "../Button";
import DropdownButton from "../DropdownButton";
import { leaveChatRoom } from "../../utils/apis/serverAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ChatRoomHeaderProps {
  chatRoomDetails: ChatRoomDetailsType | null;
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
      {chatRoomDetails ? (
        <>
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              className="mr-2 p-2"
              onClick={() => navigate("/chat")}
            >
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
        </>
      ) : (
        <span className="flex h-full w-full items-center justify-start text-sm text-neutral-400 px-5">
          참여 중인 채팅방이 없습니다.
        </span>
      )}
    </div>
  );
}
