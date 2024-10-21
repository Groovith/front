import { MessageCirclePlus } from "lucide-react";
import { Button } from "../Button";

interface ChatHeaderProps {
  setIsModalOpen: (value: boolean) => void;
}

export default function ChatHeader({ setIsModalOpen }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3">
      <h1 className="text-2xl font-bold">채팅방</h1>
      <div className="flex gap-1">
        <Button
          variant={"ghost"}
          onClick={() => setIsModalOpen(true)}
        >
            <MessageCirclePlus />
        </Button>
      </div>
    </div>
  );
}
