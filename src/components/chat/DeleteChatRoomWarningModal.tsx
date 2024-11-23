import { Button } from "../common/Button";
import H2 from "../common/H2";
import { Modal } from "../common/Modal";

interface DeleteChatRoomWarningModalProps {
  onClose: () => void;
  handleDeleteChatRoom: () => void;
}

export default function DeleteChatRoomWarningModal({
  onClose,
  handleDeleteChatRoom,
}: DeleteChatRoomWarningModalProps) {
  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="flex flex-col gap-5 whitespace-pre-wrap w-full">
        <H2>채팅방을 삭제하시겠습니까?</H2>
        <p className="text-neutral-500">
          채팅방을 삭제하면 메시지와 플레이리스트가 모두 삭제되며 복구할 수
          없습니다.
        </p>
        <div className="flex w-full justify-between gap-2">
          <Button variant={"white"} className="w-full" onClick={onClose}>취소</Button>
          <Button className="w-full" onClick={handleDeleteChatRoom}>삭제</Button>
        </div>
      </div>
    </Modal>
  );
}
