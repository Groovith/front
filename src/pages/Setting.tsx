import { KeyRound, UserX2 } from "lucide-react";
import SettingButtonItem from "../components/setting/SettingButtonItem";
import LogoutButton from "../components/setting/LogoutButton";

export default function Setting() {
  return (
    <div className="flex h-full w-full justify-center px-10 py-16">
      <div className="flex h-full w-full max-w-screen-md flex-col gap-16">
        <h1 className="text-2xl font-bold">설정</h1>
        <div>
          <h2 className="mb-5 text-xl font-bold">계정</h2>
          <LogoutButton />
          <SettingButtonItem>
            <KeyRound />
            <span>비밀번호 변경</span>
          </SettingButtonItem>
          <SettingButtonItem>
            <UserX2 />
            <span>회원 탈퇴</span>
          </SettingButtonItem>
        </div>
      </div>
    </div>
  );
}
