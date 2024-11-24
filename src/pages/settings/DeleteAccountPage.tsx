import { useState } from "react";
import H2 from "../../components/common/H2";
import SettingDetailsHeader from "../../components/setting/SettingDetailsHeader";
import { Button } from "../../components/common/Button";
import { deleteAccount } from "../../utils/apis/user/deleteAccount.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const handleDeleteAccount = async () => {
    if (!password.trim()) return;
    try {
      await deleteAccount(password);
      toast.success("계정이 정상적으로 삭제되었습니다.");
      navigate("/login");
    } catch (e) {
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          toast.error("비밀번호가 일치하지 않습니다.");
        } else {
          toast.error("회원탈퇴 처리 중 문제가 발생하였습니다.");
        }
      }
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <SettingDetailsHeader title="계정 탈퇴" />
      <div className="flex flex-col gap-2">
        <H2 className="mb-2">주의</H2>
        <p className="mb-1 text-neutral-900">
          계정 탈퇴시 다음과 같이 조치되며 복구할 수 없습니다.
        </p>
        <p className="mb-5 text-neutral-600">
          1. 이메일과 프로필 사진 등 모든 개인정보가 삭제됩니다. <br />
          2. 전송된 메시지는 삭제되지 않습니다. <br />
          3. 방장으로 있는 모든 채팅방이 삭제됩니다.
        </p>
        <div className="mb-6 flex flex-col gap-3">
          <p className="font-bold">비밀번호</p>
          <p className="text-neutral-400">
            본인 확인을 위해 현재 계정의 비밀번호를 입력해주세요.
          </p>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="··········"
            className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
          />
        </div>
        <Button className="w-full" onClick={handleDeleteAccount}>
          탈퇴하기
        </Button>
      </div>
    </div>
  );
}
