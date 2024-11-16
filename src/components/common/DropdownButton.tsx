import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export interface DropdownItem {
  label: string;
  action: () => void;
  Icon?: LucideIcon;
}

interface DropdownProps {
  children: ReactNode;
  items: DropdownItem[];
}

export default function DropdownButton({ children, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 메뉴 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // 이벤트리스너 설정 및 해제
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 메뉴 토글
  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // 메뉴가 화면 밖으로 나가지 않도록 조정
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const { top, right, bottom, left } =
        menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 이동할 거리 계산
      let offsetY = 0;
      let offsetX = 0;

      // 위쪽으로 나갔을 경우
      if (top < 0) {
        offsetY = -top; // top이 0보다 작으면 위쪽으로 나간 만큼 이동
      }
      // 아래쪽으로 나갔을 경우
      if (bottom > viewportHeight) {
        offsetY = Math.min(offsetY, viewportHeight - bottom); // 아래쪽으로 나간 만큼 이동
      }
      // 왼쪽으로 나갔을 경우
      if (left < 0) {
        offsetX = -left; // left가 0보다 작으면 왼쪽으로 나간 만큼 이동
      }
      // 오른쪽으로 나갔을 경우
      if (right > viewportWidth) {
        offsetX = Math.min(offsetX, viewportWidth - right); // 오른쪽으로 나간 만큼 이동
      }

      // 메뉴 위치 조정
      if (offsetY !== 0 || offsetX !== 0) {
        menuRef.current.style.position = "absolute";
        menuRef.current.style.top = `${menuRef.current.offsetTop + offsetY}px`;
        menuRef.current.style.left = `${menuRef.current.offsetLeft + offsetX}px`;
      }
    }
  }, [isOpen]);

  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative flex gap-2" onClick={handleClick} ref={buttonRef}>
        {children}
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute top-10 z-50 flex w-fit min-w-[200px] flex-col rounded-lg border bg-white py-3 shadow-lg"
          >
            {items.map((item, index) => (
              <Button
                key={index}
                variant={"ghost"}
                onClick={() => handleButtonClick(item.action)}
                className="flex w-full gap-3 rounded-none px-4"
              >
                {item.Icon && <item.Icon />}
                <p className="w-fit whitespace-nowrap text-left">
                  {item.label}
                </p>
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
