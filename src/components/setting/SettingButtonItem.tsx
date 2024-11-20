import { ReactNode } from "react";
import { Button } from "../common/Button";
import { ChevronRight } from "lucide-react";

interface SettingButtonItemProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function SettingButtonItem({
  children,
  onClick
}: SettingButtonItemProps) {
  return (
    <Button
      variant={"ghost"}
      className="flex w-full justify-between rounded-md p-4"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">{children}</div>
      <ChevronRight />
    </Button>
  );
}
