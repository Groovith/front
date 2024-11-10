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
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div className="fixed inset-0 flex min-h-screen w-full items-center justify-center p-10">
        <div className="fixed inset-0 min-h-screen bg-neutral-950/50"></div>
        <div
          className="relative flex justify-center w-fit max-w-md rounded-3xl bg-white p-10 shadow-xl"
          onClick={handleInsideClick} // 모달 내부 클릭 시 이벤트 전파 방지
        >
          {children}
        </div>
      </div>
    </div>
  );
}
