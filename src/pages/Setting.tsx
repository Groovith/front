import { KeyRound, UserX2 } from "lucide-react";
import SettingButtonItem from "../components/setting/SettingButtonItem";
import LogOutButton from "../components/setting/LogOutButton";
import H1 from "../components/common/H1";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full justify-center px-10 py-16">
      <div className="flex h-full w-full max-w-screen-md flex-col gap-16">
        <H1>설정</H1>
        <div>
          <h2 className="mb-5 text-xl font-bold">계정</h2>
          <LogOutButton />
          <SettingButtonItem onClick={() => navigate("/setting/change-password")}>
            <KeyRound />
            <span>비밀번호 변경</span>
          </SettingButtonItem>
          <SettingButtonItem onClick={() => navigate("/setting/delete-account")}>
            <UserX2 />
            <span>계정 탈퇴</span>
          </SettingButtonItem>
        </div>
      </div>
    </div>
  );
}
