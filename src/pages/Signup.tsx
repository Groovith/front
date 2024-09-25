import { useState, useRef } from "react";
import {
  api,
  checkEmail,
  checkEmailCertification,
  checkUsername,
  requestEmailCertification,
  signup,
} from "../utils/apis/serverAPI";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { ResponseCode } from "../types/enums";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [emailCertification, setEmailCertification] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null); // 이메일 에러 상태
  const [emailExistsError, setEmailExistsError] = useState<string | null>(null); // 이메일 중복 에러 상태
  const [certificationMessage, setCertificationMessage] = useState<
    string | null
  >(null); // 이메일 인증 관련 메시지
  const [certificationCheckMessage, setCertificationCheckMessage] = useState<
    string | null
  >(null); // 이메일 인증 번호 확인 메시지
  const [certificationValid, setCertificationValid] = useState<boolean | null>(
    null,
  ); // 이메일 인증 상태
  const [usernameCheckMessage, setUsernameCheckMessage] = useState<
    string | null
  >(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerifyRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => signup({ username, password, email }),
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

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    const emailErrorMessage = validateEmail(email);
    setEmailError(emailErrorMessage);

    if (!emailErrorMessage) {
      try {
        const response = await checkEmail({ email });
        if (response.code === ResponseCode.SUCCESS) {
          setEmailExistsError(null);
        }
      } catch (e: any) {
        console.log(e.response.data.code);
        if (e.response.data.code === ResponseCode.DUPLICATE_ID) {
          setEmailExistsError("✗ 이미 가입된 이메일입니다.");
        } else {
          setEmailExistsError("이메일 중복 확인 중 오류가 발생했습니다.");
        }
      }
    }
  };

  // 이메일 인증번호 요청
  const handleRequestEmailCertification = async (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!validateEmail(email)) {
      setCertificationMessage(
        "인증번호가 이메일로 전송되었습니다. 5분 안에 회원가입을 완료해주세요.",
      );
      try {
        const response = await requestEmailCertification({ email });
        if (response.code === ResponseCode.SUCCESS) {
          setCertificationMessage(
            "인증번호가 이메일로 전송되었습니다. 5분 안에 회원가입을 완료해주세요.",
          );
          setCertificationValid(null); // Reset validation on new request
        } else {
          setCertificationMessage("인증번호 전송에 실패했습니다.");
        }
      } catch (error) {
        setCertificationMessage("이메일 인증 요청 중 오류가 발생했습니다.");
      }
    } else {
      setCertificationMessage("유효한 이메일을 입력해주세요.");
    }
  };

  // 이메일 인증번호 확인
  const handleCheckEmailCertification = async () => {
    if (emailCertification) {
      try {
        const response = await checkEmailCertification({
          email,
          certificationNumber: emailCertification,
        });
        if (response.code === ResponseCode.SUCCESS) {
          setCertificationCheckMessage("✓ 인증번호가 확인되었습니다.");
          setCertificationValid(true);
        }
      } catch (e: any) {
        if (e.response.data.code === ResponseCode.CERTIFICATION_FAIL) {
          setCertificationCheckMessage("✗ 인증번호가 올바르지 않습니다.");
          setCertificationValid(false);
        } else {
          setCertificationCheckMessage("인증번호 확인 중 오류가 발생했습니다.");
          setCertificationValid(false);
        }
      }
    } else {
      setCertificationCheckMessage("인증번호를 입력해주세요.");
    }
  };

  // 이메일 인증번호 입력 후 포커스 해제 시 확인
  const handleEmailCertificationBlur = async () => {
    await handleCheckEmailCertification();
  };

  // 사용자 이름 사용 가능 여부 체크
  const handleCheckUsername = async () => {
    if (username) {
      try {
        const response = await checkUsername({ username });
        if (response.code === ResponseCode.SUCCESS) {
          setUsernameCheckMessage("✓ 사용 가능한 사용자 이름입니다.");
          setUsernameValid(true);
        }
      } catch (e: any) {
        if (e.response.data.code === ResponseCode.DUPLICATE_ID) {
          setUsernameCheckMessage("✗ 이미 사용 중인 사용자 이름입니다.");
          setUsernameValid(false);
        } else {
          setUsernameCheckMessage("사용자 이름 확인 중 오류가 발생했습니다.");
          setUsernameValid(false);
        }
      }
    } else {
      setUsernameCheckMessage(null); // 사용자 이름 입력 필드가 비어 있을 경우 메시지 초기화
      setUsernameValid(null);
    }
  };

  // 회원가입 폼 제출
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 이메일 중복 확인 호출
    await handleCheckEmail();

    // 비밀번호 검증 및 포커스 이동 처리
    if (validatePassword(password)) {
      passwordRef.current?.focus();
    } else if (password !== passwordVerify) {
      passwordVerifyRef.current?.focus();
    } else if (!usernameValid) {
      usernameRef.current?.focus();
    } else if (
      !emailError &&
      !emailExistsError &&
      certificationValid &&
      usernameValid
    ) {
      mutate(); // 모든 조건이 충족되면 회원가입 요청
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
                ref={emailRef}
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleCheckEmail} // 이메일 입력 후 focus가 해제되면 중복 확인
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
              {emailExistsError && (
                <p className="text-sm text-red-500">{emailExistsError}</p>
              )}
            </div>
            <Button className="mb-3" onClick={handleRequestEmailCertification}>
              인증번호 요청
            </Button>
            {certificationMessage && (
              <p className="mb-6 text-sm text-blue-500">
                {certificationMessage}
              </p>
            )}
            <div className="mb-3 flex flex-col gap-3">
              <label htmlFor="emailCertification">이메일 인증번호</label>
              <input
                id="emailCertification"
                type="text"
                required
                value={emailCertification}
                onChange={(e) => setEmailCertification(e.target.value)}
                onBlur={handleEmailCertificationBlur} // 포커스 해제 시 인증번호 확인
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
            </div>
            {certificationCheckMessage && (
              <p
                className={`mb-6 text-sm ${certificationValid ? "text-green-500" : "text-red-500"}`}
              >
                {certificationCheckMessage}
              </p>
            )}
            <div className="mb-3 flex flex-col gap-3">
              <label htmlFor="username">사용자 이름</label>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@"
                className="h-8 w-full rounded-lg border px-3 py-5"
                onBlur={handleCheckUsername}
              />
            </div>
            {usernameCheckMessage && (
              <p
                className={`mb-6 text-sm ${usernameValid ? "text-green-500" : "text-red-500"}`}
              >
                {usernameCheckMessage}
              </p>
            )}
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
                className="h-8 w-full rounded-lg border px-3 py-5"
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
                className="h-8 w-full rounded-lg border px-3 py-5"
              />
              {isPasswordMatch ? (
                <p className="text-sm text-green-500">
                  ✓ 비밀번호와 일치합니다
                </p>
              ) : (
                passwordVerify && (
                  <p className="text-sm text-red-500">
                    ✗ 비밀번호와 일치하지 않습니다
                  </p>
                )
              )}
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
