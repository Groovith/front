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

  // 메뉴 외부 클릭시 메뉴 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
  const handleClick = (): void => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false);
  }

  return (
    <div>
      <div className="flex gap-2" onClick={handleClick}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute flex flex-col rounded-lg border bg-white py-3 shadow-lg min-w-[220px]"
        >
          {items.map((item, index) => (
            <Button
              key={index}
              variant={"ghost"}
              onClick={() => handleButtonClick(item.action)}
              className="flex gap-3 rounded-none px-4"
            >
              {item.Icon && <item.Icon />}
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
