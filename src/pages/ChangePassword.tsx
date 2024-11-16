import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../utils/apis/serverAPI";
import { toast } from "sonner";
import { Button } from "../components/common/Button";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerifyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const code = searchParams.get("code");
    setEmail(email);
    setCode(code);
  });

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
  const isLengthValid = password.length >= 8 && password.length <= 32;
  const hasTwoTypes =
    /(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(
      password,
    );
  const isPasswordMatch = password === passwordVerify && passwordVerify !== ""; // 비밀번호와 비밀번호 확인 일치 여부 확인

  // 비밀번호 변경 요청
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email == null || code == null) return;

    // 비밀번호 검증 및 포커스 이동 처리
    if (validatePassword(password)) {
      passwordRef.current?.focus();
    } else if (password !== passwordVerify) {
      passwordVerifyRef.current?.focus();
    } else {
      try {
        await resetPassword(email, code, password);
        toast.success("비밀번호가 변경되었습니다.");
        navigate("/login");
      } catch (e) {
        toast.error("비밀번호 변경 중 문제가 발생하였습니다.");
      }
    }
  };

  return (
    <div className="flex size-full justify-center items-center py-20 px-5">
      <div className="flex h-fit w-fit flex-col">
        <h1 className="text-2xl font-bold mb-3 w-full flex justify-center">비밀번호 변경</h1>
        <h2 className="text-neutral-500 mb-8 w-full flex justify-center">변경할 비밀번호를 입력해 주세요.</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col gap-3">
            <label htmlFor="password">비밀번호</label>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="··········"
              className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
            />
          </div>
          <div className="mb-6 flex flex-col gap-3">
            <label htmlFor="password-verify">비밀번호 확인</label>
            <input
              ref={passwordVerifyRef}
              id="password-verify"
              type="password"
              required
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
              placeholder="··········"
              className="h-8 w-full rounded-lg border px-3 py-5 placeholder:text-xl"
            />
            {isPasswordMatch ? (
              <p className="text-sm text-green-500">✓ 비밀번호와 일치합니다</p>
            ) : (
              passwordVerify && (
                <p className="text-sm text-red-500">
                  ✗ 비밀번호와 일치하지 않습니다
                </p>
              )
            )}
          </div>
          <Button className="w-full">비밀번호 변경</Button>
        </form>
      </div>
    </div>
  );
}
