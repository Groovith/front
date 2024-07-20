import { Home, Menu, Search, Send, UserRound, Settings } from "lucide-react";
import logo from "../assets/Logo-Full-BW.png";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../components/DropdownButton";

export default function Sidebar() {
  const navigate = useNavigate();

  // 더보기 버튼
  const moreButtonItems = [{ label: "설정", action: () => {navigate("/setting")}, Icon: Settings }];

  return (
    <div className="flex flex-none h-full w-[80px] flex-col items-center justify-start gap-y-10 border-r border-gray-200 pt-3">
      {/* 로고 버튼 */}
      <div>
        <Button variant={"ghost"}>
          <img src={logo} alt="Logo" className="w-10" />
        </Button>
      </div>
      {/* 그 외 버튼 */}
      <div className="flex flex-col items-center gap-3">
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/");
          }}
        >
          <Home />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/search");
          }}
        >
          <Search />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/chat");
          }}
        >
          <Send />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate("/profile");
          }}
        >
          <UserRound />
        </Button>
        <DropdownButton items={moreButtonItems}>
          <Menu />
        </DropdownButton>
      </div>
    </div>
  );
}
