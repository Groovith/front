import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import {
  Home,
  LogOut,
  Menu,
  Search,
  Send,
  Settings,
  UserRound,
} from "lucide-react";
import { logout } from "../utils/apis/serverAPI";
import { Button } from "../components/Button";
import DropdownButton from "../components/DropdownButton";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId } = useChatRoomStore();

  // 더보기 버튼
  const moreButtonItems = [
    {
      label: "설정",
      action: () => {
        navigate("/setting");
      },
      Icon: Settings,
    },
    {
      label: "로그아웃",
      action: async () => {
        try {
          await logout();
        } catch (e) {
          console.log("로그아웃 에러: ", e);
        } finally {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      },
      Icon: LogOut,
    },
  ];

  const handleUserClick = async () => {
    navigate(`/user/${getUsername()}`);
  };

  return (
    <div className="flex bottom-0 left-0 w-full justify-around border-t border-gray-200 bg-neutral-50 p-2 md:hidden">
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
      <DropdownButton items={moreButtonItems}>
        <Button variant={"ghost"}>
          <Menu />
        </Button>
      </DropdownButton>
    </div>
  );
}
