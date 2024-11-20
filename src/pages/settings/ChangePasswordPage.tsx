import { useRef, useState } from "react";
import SettingDetailsHeader from "../../components/setting/SettingDetailsHeader";
import { Button } from "../../components/common/Button";
import { changePassword } from "../../utils/apis/user/changePassword.api";
import { toast } from "sonner";
import { AxiosError, isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVerify, setNewPasswordVerify] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerifyRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 비밀번호 규칙 확인 함수
  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const maxLength = 32;
    const hasTwoTypes =
      /(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])/;

    if (password.length < minLength || password.length > maxLength) {
      return true;
    }

    if (!hasTwoTypes.test(password)) {
      return true;
    }

    return false; // 에러가 없으면 false 반환
  };

  // 비밀번호 조건을 실시간으로 체크하기 위한 상태
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 32;
  const hasTwoTypes =
    /(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(
      newPassword,
    );
  const isPasswordMatch =
    newPassword === newPasswordVerify && newPasswordVerify !== ""; // 비밀번호와 비밀번호 확인 일치 여부 확인

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword !== newPasswordVerify || !validatePassword) return;
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("비밀번호를 변경하였습니다.");
      navigate(-1);
    } catch (e) {
      if (isAxiosError(e)) {
        if (e.code === AxiosError.ERR_BAD_REQUEST) {
          toast.error("기존 비밀번호가 일치하지 않습니다.");
        } else {
          toast.error("비밀번호 변경 중 문제가 발생하였습니다.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <SettingDetailsHeader title="비밀번호 변경" />
      {/** 비밀번호, 비밀번호 확인, 저장 버튼 구현 */}
      <div className="flex flex-col">
        <div className="mb-6 flex flex-col gap-3">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="··········"
            className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
          />
        </div>
        <div className="mb-6 flex flex-col gap-3">
          <label htmlFor="password">새 비밀번호</label>
          <p className="text-sm">
            {isLengthValid ? (
              <span className="text-green-500">
                ✓ 8자 이상 32자 이하로 입력(공백 제외)
              </span>
            ) : (
              <span className="text-red-500">
                ✗ 8자 이상 32자 이하로 입력(공백 제외)
              </span>
            )}
            <br />
            {hasTwoTypes ? (
              <span className="text-green-500">
                ✓ 영문/숫자/특수문자 중 2가지 이상을 포함
              </span>
            ) : (
              <span className="text-red-500">
                ✗ 영문/숫자/특수문자 중 2가지 이상을 포함
              </span>
            )}
          </p>
          <input
            ref={passwordRef}
            id="password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="··········"
            className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
          />
        </div>
        <div className="mb-6 flex flex-col gap-3">
          <label htmlFor="password-verify">새 비밀번호 확인</label>
          <input
            ref={passwordVerifyRef}
            id="password-verify"
            type="password"
            required
            value={newPasswordVerify}
            onChange={(e) => setNewPasswordVerify(e.target.value)}
            placeholder="··········"
            className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
          />
          {isPasswordMatch ? (
            <p className="text-sm text-green-500">✓ 비밀번호와 일치합니다</p>
          ) : (
            newPasswordVerify && (
              <p className="text-sm text-red-500">
                ✗ 비밀번호와 일치하지 않습니다
              </p>
            )
          )}
        </div>
      </div>
      <Button className="w-full" onClick={handleChangePassword}>
        비밀번호 변경
      </Button>
    </div>
  );
}
