import {
  Home,
  Menu,
  Search,
  UserRound,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import logo from "../assets/Logo-Full-BW.png";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../components/common/DropdownButton";
import { logout } from "../utils/apis/serverAPI";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { ButtonWithText } from "../components/common/ButtonWithText";

export default function Sidebar() {
  const navigate = useNavigate();
  const { getUsername } = useUser();
  const { setCurrentChatRoomId, closeCurrentChatRoom } = useChatRoomStore();

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
        // 로그아웃 로직 (로그아웃 API 호출 -> localStorage에서 토큰 삭제)
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

  const handleButtonClick = (navigateTo: string) => {
    navigate(navigateTo);
    closeCurrentChatRoom();
  };
  
  const buttonStyle = "hover:bg-neutral-100 w-full p-3 rounded-xl text-neutral-700";

  return (
    <div className="hidden h-full w-[80px] flex-none flex-col items-center justify-start gap-y-10 border-r border-gray-200 pt-8 md:flex">
      {/* 로고 버튼 */}
      <div>
        <Button variant={"ghost"} onClick={() => handleButtonClick("/")}>
          <img src={logo} alt="Logo" className="w-10" />
        </Button>
      </div>
      {/* 그 외 버튼 */}
      <div className="flex flex-col items-center">
        <ButtonWithText
          onClick={() => {
            handleButtonClick("/");
          }}
          Icon={Home}
          text="홈"
          className={buttonStyle}
        />
        <ButtonWithText
          onClick={() => {
            handleButtonClick("/search");
          }}
          Icon={Search}
          text="검색"
          className={buttonStyle}
        />
        <ButtonWithText
          onClick={() => {
            handleButtonClick("/chat");
            setCurrentChatRoomId(-1);
          }}
          Icon={MessageCircle}
          text="채팅"
          className={buttonStyle}
        />
        <ButtonWithText
          onClick={() => handleButtonClick(`/user/${getUsername()}`)}
          Icon={UserRound}
          text="프로필"
          className={buttonStyle}
        />
        <DropdownButton items={moreButtonItems}>
          <ButtonWithText
            onClick={() => {}}
            Icon={Menu}
            text="더보기"
            className={buttonStyle}
          />
        </DropdownButton>
      </div>
    </div>
  );
}
