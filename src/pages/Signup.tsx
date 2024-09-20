import { useState } from "react";
import { api, signup } from "../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [emailCertification, setEmailCertification] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null); // 이메일 에러 상태
  const [passwordError, setPasswordError] = useState<string | null>(null); // 비밀번호 에러 메시지 상태
  const [passwordVerifyError, setPasswordVerifyError] = useState<string | null>(null); // 비밀번호 확인 에러 상태

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => signup({ username: username, password: password }),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (e) => {
      console.log("회원가입 에러: ", e);
    },
  });

  // 이메일 형식 확인 함수
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식을 검증하는 정규 표현식
    if (!emailRegex.test(email)) {
      return "유효한 이메일 형식이 아닙니다.";
    }
    return null; // 에러가 없으면 null 반환
  };

  // 비밀번호 규칙 확인 함수
  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 32;
    const hasTwoTypes = /(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])/;

    if (password.length < minLength || password.length > maxLength) {
      return `비밀번호는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`;
    }

    if (!hasTwoTypes.test(password)) {
      return "비밀번호는 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.";
    }

    return null; // 에러가 없으면 null 반환
  };

  // 회원가입 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 이메일 형식 검증
    const emailErrorMessage = validateEmail(email);
    setEmailError(emailErrorMessage);

    // 비밀번호 검증
    const passwordErrorMessage = validatePassword(password);
    setPasswordError(passwordErrorMessage);

    if (password !== passwordVerify) {
      setPasswordVerifyError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordVerifyError(null);
    }

    if (!emailErrorMessage && !passwordErrorMessage && password === passwordVerify) {
      mutate();
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-[400px] flex-col gap-y-14 rounded-xl border border-gray-300 p-10">
          <h1 className="text-3xl font-bold">가입하고 같이 들어요!</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>} {/* 이메일 에러 메시지 */}
            </div>
            <Button className="mb-6">인증번호 요청</Button>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="emailCertification">이메일 인증번호</label>
              <input
                id="emailCertification"
                type="text"
                required
                value={emailCertification}
                onChange={(e) => setEmailCertification(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="username">사용자 이름</label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@"
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="password">비밀번호</label>
              <p className="text-sm text-neutral-500">
                - 8자 이상 32자 이하로 입력(공백 제외)
                <br />
                - 영문/숫자/특수문자 중 2가지 이상을 포함
              </p>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* 비밀번호 에러 메시지 */}
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label htmlFor="password-verify">비밀번호 확인</label>
              <input
                id="password-verify"
                type="password"
                required
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
              {passwordVerifyError && <p className="text-red-500 text-sm">{passwordVerifyError}</p>} {/* 비밀번호 확인 에러 메시지 */}
            </div>
            <Button className="w-full">가입하기</Button>
          </form>
          <div className="flex items-center gap-4">
            <p>사실 계정이 있으신가요?</p>
            <Button
              variant={"ghost"}
              className="font-bold text-sky-600"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 flex w-full justify-center space-x-4 text-sm text-gray-500">
        <a>© 2024 Groovith</a>
        <a>소개</a>
        <a>약관</a>
        <a>개인정보처리방침</a>
        <a>쿠키 정책</a>
        <a>문제 신고</a>
      </div>
    </div>
  );
}
