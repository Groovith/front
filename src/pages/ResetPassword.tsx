import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { checkEmail } from "../utils/apis/serverAPI";
import { ResponseCode } from "../types/enums";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null); // 이메일 유효성 상태
  const emailRef = useRef<HTMLInputElement>(null);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규 표현식
    if (emailRegex.test(email)) {
      setEmailErrorMessage(null);
      return true;
    } else {
      setEmailErrorMessage("✗ 이메일 형식이 올바르지 않습니다");
      return false;
    }
  };

  // 이메일 중복 확인
  const checkIfEmailExists = async (email: string) => {
    try {
      const response = await checkEmail({ email });
      if (response.code === ResponseCode.SUCCESS) {
        setEmailErrorMessage("✗ 존재하지 않는 계정입니다.");
        setEmailValid(false); // 이메일 중복 없으면 유효하다고 설정
      }
    } catch (e: any) {
      if (e.response.data.code === ResponseCode.DUPLICATE_ID) {
        setEmailErrorMessage(null);
        setEmailValid(true); // 중복된 이메일로 유효하지 않음
      } else {
        setEmailErrorMessage("이메일 중복 확인 중 오류가 발생했습니다.");
        setEmailValid(false); // 오류 발생 시 유효하지 않음
      }
    }
  };

  // 이메일 입력 완료 후 호출되는 함수 (onBlur 사용)
  const handleEmailBlur = () => {
    if (validateEmail(email)) {
      checkIfEmailExists(email); // 이메일 형식이 올바른 경우 중복 확인
    } else {
      setEmailValid(false); // 이메일 형식이 잘못되었을 때 처리
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center text-neutral-900">
      <div className="flex w-fit flex-col items-center justify-center rounded-xl border border-gray-300 p-10">
        <h1 className="mb-4 text-3xl font-bold">에구머니나!</h1>
        <h2 className="mb-8 text-xl font-bold text-neutral-700">
          비밀번호를 잊어버리셨나요?
        </h2>
        <p className="mb-8 text-neutral-700">
          아래에 가입한 이메일을 입력해 주세요. <br />
          해당 이메일을 통해 비밀번호 변경 링크가 전송됩니다.
        </p>
        <div className="flex w-full flex-col justify-start">
          <input
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 입력 값만 설정
            onBlur={handleEmailBlur} // 입력이 완료되면 유효성 검사 및 중복 확인
            className={`h-8 w-full rounded-lg border px-3 py-5 ${
              emailValid === false ? "border-red-500" : "border-gray-300"
            }`} // 이메일이 유효하지 않으면 빨간 테두리
            placeholder="example@email.com"
          />
          {emailErrorMessage && (
            <p className="mt-3 text-sm text-red-500">{emailErrorMessage}</p>
          )}
        </div>
        <Button className="mt-6 w-full rounded-lg px-6">
          변경 링크 전송하기
        </Button>
      </div>
    </div>
  );
}
