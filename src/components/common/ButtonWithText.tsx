import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";

interface ButtonWithTextProps {
  onClick: () => void;
  Icon: LucideIcon;
  text: string;
  className?: string;
}

export function ButtonWithText({
  onClick,
  Icon,
  text,
  className,
}: ButtonWithTextProps) {
  const style =
    "flex flex-col items-center justify-center gap-1 px-2 py-0 text-xs text-neutral-900";
  return (
    <Button
      variant={"transparent"}
      className={twMerge(style, className)}
      onClick={onClick}
    >
      <Icon />
      <p>{text}</p>
    </Button>
  );
}
