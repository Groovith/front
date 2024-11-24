import { useState, useRef } from "react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ResponseCode } from "../../types/enums";
import { checkUsername } from "../../utils/apis/serverAPI";
import { changeUsername } from "../../utils/apis/user/changeUsername.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const usernameRule =
  "사용자 이름은 2자 이상, 30자 이하의 영문 소문자, 숫자, 밑줄, 마침표만 허용하며, 시작과 끝에 밑줄이나 마침표를 사용할 수 없습니다.";

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
  const [newUsername, setNewUsername] = useState(username ? username : "");
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 사용자 이름 규칙 확인 함수
  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-z0-9_](?!.*\\.{2})[a-z0-9._]*[a-z0-9_]$/;
    if (!usernameRegex.test(username)) {
      setUsernameValid(false);
      return false;
    }
    return true;
  };

  // 사용자 이름 사용 가능 여부 체크
  const handleCheckUsername = async () => {
    if (!newUsername || username === newUsername) {
      setUsernameCheckMessage(null);
      setUsernameValid(null);
      return;
    }

    if (!validateUsername(newUsername)) {
      setUsernameCheckMessage(usernameRule);
      return;
    } else {
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
  };

  const handleChangeUsername = async () => {
    if (!usernameValid || !newUsername) return;
    try {
      await changeUsername(newUsername);
      toast.success("사용자 이름을 변경하였습니다.");
      navigate(`/user/${newUsername}`);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("사용자 이름 변경 중 문제가 발생하였습니다.");
    }
  };

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
