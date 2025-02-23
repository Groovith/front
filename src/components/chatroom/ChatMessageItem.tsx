import { useNavigate } from "react-router-dom";
import { MessageType } from "../../types/types";
import { formatDateTime } from "../../utils/formatDateTime";

interface ChatMessageItemProps {
  message: MessageType;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate(`/user/${message.username}`);
  };
  return (
    <li key={message.messageId} className="flex gap-3 break-normal">
      <img
        src={message.imageUrl}
        className="size-10 flex-none cursor-pointer rounded-full object-cover"
        onClick={handleProfileClick}
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p>{message.username}</p>
          <p className="text-sm text-neutral-400">
            {formatDateTime(message.createdAt)}
          </p>
        </div>
        <p className="flex w-fit justify-start rounded-lg bg-white px-3 py-2 shadow-lg">
          {message.content}
        </p>
      </div>
    </li>
  );
}
