import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { checkEmail, requestPasswordReset } from "../utils/apis/serverAPI";
import { ResponseCode } from "../types/enums";
import { Modal } from "../components/Modal";
import { MoonLoader } from "react-spinners";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(
    null,
  );
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

  // 비밀번호 변경 링크 요청 버튼
  const handleRequestUrlClick = async () => {
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setIsModalOpen(true);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center text-neutral-900">
      <div className="flex w-fit flex-col items-center justify-center rounded-xl border border-gray-300 p-10">
        <h1 className="mb-4 text-3xl font-bold">비밀번호 찾기</h1>
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
        <Button
          className="mt-6 flex w-full justify-center gap-3 rounded-lg px-6"
          onClick={handleRequestUrlClick}
          disabled={loading}
        >
          {loading ? (
            <MoonLoader size={18} color="#FFFFFF" />
          ) : (
            <p>변경 링크 전송하기</p>
          )}
        </Button>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-5">
            <h1 className="font-bold">비밀번호 설정 메일 발송</h1>
            <div className="flex rounded-xl bg-neutral-200 p-3 font-bold gap-3">
              <Mail />
              {email}
            </div>
            <p className="w-full text-neutral-600">
              위 이메일로 비밀번호 설정 메일이 발송되었습니다. 메일이 보이지
              않을 경우, 스팸함을 확인해 주세요.
            </p>
            <Button
              onClick={() => {
                navigate(-1);
              }}
            >
              이전 페이지로
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
