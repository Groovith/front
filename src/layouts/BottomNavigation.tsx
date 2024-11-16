import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { Home, Menu, Search, Send, UserRound } from "lucide-react";

import { Button } from "../components/common/Button";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId, closeCurrentChatRoom } = useChatRoomStore();

  const handleButtonClick = (navigateTo:string) => {
    navigate(navigateTo);
    closeCurrentChatRoom();
  }

  return (
    <div className="bottom-0 left-0 flex w-full justify-around border-t border-gray-200 bg-neutral-50 p-2 md:hidden">
      <Button variant={"ghost"} onClick={() => handleButtonClick("/")}>
        <Home />
      </Button>
      <Button variant={"ghost"} onClick={() => handleButtonClick("/search")}>
        <Search />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          handleButtonClick("/chat");
          setCurrentChatRoomId(-1);
        }}
      >
        <Send />
      </Button>
      <Button variant={"ghost"} onClick={() => handleButtonClick(`/user/${getUsername()}`)}>
        <UserRound />
      </Button>
      <Button variant={"ghost"} onClick={() => handleButtonClick("/setting")}>
        <Menu />
      </Button>
    </div>
  );
}
