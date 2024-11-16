import { useState, useRef } from "react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ResponseCode } from "../../types/enums";
import { checkUsername } from "../../utils/apis/serverAPI";

interface UsernameModalProps {
  onClose: () => void;
  username: string | undefined;
}

export default function UsernameModal({
  onClose,
  username,
}: UsernameModalProps) {
  const [usernameCheckMessage, setUsernameCheckMessage] = useState<
    string | null
  >(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  // 사용자 이름 규칙 확인 함수
  const validateUsername = (username: string): string | null => {
    const usernameRegex = /^(?!.*[_.]{2})[a-z0-9._]{2,30}$/;
    if (
      !usernameRegex.test(username) ||
      username.startsWith("_") ||
      username.startsWith(".") ||
      username.endsWith("_") ||
      username.endsWith(".")
    ) {
      setUsernameValid(false);
      return "사용자 이름은 2자 이상, 30자 이하의 영문 소문자, 숫자, 밑줄, 마침표만 허용하며, 시작과 끝에 밑줄이나 마침표를 사용할 수 없습니다.";
    }
    return null;
  };

  // 사용자 이름 사용 가능 여부 체크
  const handleCheckUsername = async () => {
    const usernameErrorMessage = validateUsername(newUsername);
    setUsernameCheckMessage(usernameErrorMessage);

    if (!usernameErrorMessage) {
      try {
        const response = await checkUsername({ username: newUsername });
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
    }

    if (!newUsername) {
      setUsernameCheckMessage(null); // 사용자 이름 입력 필드가 비어 있을 경우 메시지 초기화
      setUsernameValid(null);
    }
  };

  const handleChangeUsername = async () => {};

  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="mb-3 flex w-[300px] flex-col gap-5">
        <h1 className="text-xl font-bold">사용자 이름 변경</h1>
        <label htmlFor="username">사용자 이름</label>
        <input
          ref={usernameRef}
          id="username"
          type="text"
          required
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder={username}
          className="h-8 w-full rounded-lg border px-3 py-5"
          onBlur={handleCheckUsername}
        />
        {usernameCheckMessage && (
          <p
            className={`mb-6 text-sm ${usernameValid ? "text-green-500" : "text-red-500"}`}
          >
            {usernameCheckMessage}
          </p>
        )}
        <div className="flex justify-between gap-3">
          <Button variant={"ghost"} className="w-full border" onClick={onClose}>
            취소
          </Button>
          <Button
            className="w-full"
            disabled={!usernameValid}
            onClick={handleChangeUsername}
          >
            변경하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
