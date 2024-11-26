import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { Home, Menu, MessageCircle, Search, UserRound } from "lucide-react";
import { ButtonWithText } from "../components/common/ButtonWithText";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId, closeCurrentChatRoom } = useChatRoomStore();

  const handleButtonClick = (navigateTo: string) => {
    navigate(navigateTo);
    closeCurrentChatRoom();
  };

  return (
    <div className="bottom-0 left-0 grid grid-cols-5 w-full border-t border-gray-200 bg-neutral-50 p-2 md:hidden">
      <ButtonWithText
        onClick={() => handleButtonClick("/")}
        Icon={Home}
        text="홈"
      />
      <ButtonWithText
        onClick={() => handleButtonClick("/search")}
        Icon={Search}
        text="검색"
      />
      <ButtonWithText
        onClick={() => {
          handleButtonClick("/chat");
          setCurrentChatRoomId(-1);
        }}
        Icon={MessageCircle}
        text="채팅"
      />
      <ButtonWithText
        onClick={() => handleButtonClick(`/user/${getUsername()}`)}
        Icon={UserRound}
        text="프로필"
      />
      <ButtonWithText
        onClick={() => handleButtonClick("/setting")}
        Icon={Menu}
        text="더보기"
      />
    </div>
  );
}
