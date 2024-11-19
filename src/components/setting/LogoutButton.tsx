import { LogOut } from "lucide-react";
import SettingButtonItem from "./SettingButtonItem";

export default function LogoutButton() {
  return (
    <SettingButtonItem>
      <LogOut />
      <span>로그아웃</span>
    </SettingButtonItem>
  );
}
