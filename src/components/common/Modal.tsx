import { ReactNode, MouseEvent } from "react";

interface ModalProps {
  children: ReactNode;
  closeOnOutsideClick?: boolean; // 모달 바깥 클릭 시 닫힘 여부를 결정하는 파라미터
  onClose: () => void; // 모달을 닫는 함수
}

export function Modal({
  children,
  closeOnOutsideClick = true,
  onClose,
}: ModalProps) {
  // 바깥 영역 클릭 처리 함수
  const handleOutsideClick = () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  };

  // 모달 내부 클릭 시 전파 방지
  const handleInsideClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-full items-center justify-center"
      onClick={handleOutsideClick}
    >
      <div className="fixed inset-0 flex h-full w-full items-center justify-center p-10">
        <div className="fixed inset-0 h-full bg-neutral-950/50"></div>
        <div
          className="relative flex h-fit max-h-full w-fit max-w-md items-center justify-center rounded-3xl bg-white shadow-xl"
          onClick={handleInsideClick} // 모달 내부 클릭 시 이벤트 전파 방지
        >
          <div className="flex h-full w-full max-h-[80vh] overflow-y-auto p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
