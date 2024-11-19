import { LucideIcon } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "./Button";
import {
  useFloating,
  useInteractions,
  useClick,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

export interface DropdownItem {
  label: string;
  action: () => void;
  Icon?: LucideIcon;
}

interface DropdownProps {
  children: ReactNode;
  items: DropdownItem[];
  placement?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end"; // 위치 설정을 위한 옵션
}

export default function DropdownButton({
  children,
  items,
  placement = "bottom-start",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    placement,
    strategy: "fixed",
    middleware: [offset(4), flip(), shift()],
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const reference = refs.reference.current;
      const floating = refs.floating.current;
  
      if (
        reference instanceof HTMLElement &&
        floating instanceof HTMLElement &&
        !reference.contains(event.target as Node) &&
        !floating.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs.reference, refs.floating]);

  return (
    <div
      className="relative flex"
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...getFloatingProps()}
          className="fixed z-50 flex h-fit w-fit flex-col rounded-lg border bg-white py-3 shadow-lg"
        >
          {items.map((item, index) => (
            <Button
              key={index}
              variant={"ghost"}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleButtonClick(item.action);
              }}
              className="flex w-full gap-3 rounded-none px-4"
            >
              {item.Icon && <item.Icon />}
              <p className="w-fit whitespace-nowrap text-left">{item.label}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
