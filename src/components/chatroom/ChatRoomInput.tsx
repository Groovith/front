import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { useStompStore } from "../../stores/useStompStore";

interface ChatRoomInputProps {
  chatRoomId: number | null | undefined;
}

export default function ChatRoomInput({ chatRoomId }: ChatRoomInputProps) {
  const { stompClient } = useStompStore();
  const [message, setMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) return;

    const accessToken = localStorage.getItem("accessToken");
    if (stompClient && accessToken) {
      const messageDto = {
        content: message,
        type: "CHAT",
      };
      stompClient.publish({
        destination: `/pub/api/chat/${chatRoomId}`,
        body: JSON.stringify(messageDto),
        headers: { access: accessToken },
      });
    }

    setMessage("");
  };

  return (
    <div className="flex h-[90px] items-center justify-between border-t px-4">
      <form
        className="flex w-full justify-between gap-2"
        onSubmit={(e) => handleSendMessage(e)}
      >
        <input
          className="w-full flex-grow rounded-lg p-2 placeholder:text-neutral-400 focus:outline-none"
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={chatRoomId === null}
        />
        <Button variant="ghost" disabled={chatRoomId === null}>
          <SendHorizonal />
        </Button>
      </form>
    </div>
  );
}
