import { LogOut } from "lucide-react";
import SettingButtonItem from "./SettingButtonItem";
import { logout } from "../../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LogOutButton() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    // 로그아웃 로직 (로그아웃 API 호출 -> localStorage에서 토큰 삭제)
    try {
      await logout();
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (e) {
      toast.error("로그아웃 중 문제가 발생하였습니다.");
      console.log("로그아웃 에러: ", e);
    }
  };

  return (
    <SettingButtonItem onClick={handleLogOut}>
      <LogOut />
      <span>로그아웃</span>
    </SettingButtonItem>
  );
}
