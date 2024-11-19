import { ReactNode } from "react";
import { Button } from "../common/Button";
import { ChevronRight } from "lucide-react";

interface SettingButtonItemProps {
  children: ReactNode;
}

export default function SettingButtonItem({
  children,
}: SettingButtonItemProps) {
  return (
    <Button
      variant={"ghost"}
      className="flex w-full justify-between rounded-md p-4"
    >
      <div className="flex gap-2 items-center">{children}</div>
      <ChevronRight />
    </Button>
  );
}
