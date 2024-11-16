import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { Home, Menu, Search, Send, UserRound } from "lucide-react";

import { Button } from "../components/Button";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId } = useChatRoomStore();

  const handleUserClick = async () => {
    navigate(`/user/${getUsername()}`);
  };

  return (
    <div className="bottom-0 left-0 flex w-full justify-around border-t border-gray-200 bg-neutral-50 p-2 md:hidden">
      <Button variant={"ghost"} onClick={() => navigate("/")}>
        <Home />
      </Button>
      <Button variant={"ghost"} onClick={() => navigate("/search")}>
        <Search />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          navigate("/chat");
          setCurrentChatRoomId(-1);
        }}
      >
        <Send />
      </Button>
      <Button variant={"ghost"} onClick={handleUserClick}>
        <UserRound />
      </Button>
      <Button variant={"ghost"} onClick={() => navigate("/setting")}>
        <Menu />
      </Button>
    </div>
  );
}
