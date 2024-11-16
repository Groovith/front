import { useState } from "react";
import H1 from "../common/H1";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { addFriend } from "../../utils/apis/friends/addFriend.api";
import { toast } from "sonner";

interface AddFriendModalProps {
  onClose: () => void;
  refetch: () => void;
}

export default function AddFriendModal({
  onClose,
  refetch,
}: AddFriendModalProps) {
  const [username, setUsername] = useState("");

  const handleAddFriend = async () => {
    try {
      await addFriend(username);
      refetch();
      onClose();
    } catch (e) {
      toast.error("친구 추가 중 문제가 발생하였습니다.");
      console.error("친구 추가 요청 실패: ", e);
    }
  };

  return (
    <Modal closeOnOutsideClick={true} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <H1>친구 추가</H1>
        <p className="text-neutral-600">
          사용자 이름으로 친구를 추가할 수 있습니다.
        </p>
        <input
          type="text"
          className="w-full rounded-lg border border-neutral-200 p-2"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleAddFriend}>추가하기</Button>
      </div>
    </Modal>
  );
}
