import { useChatRoomStore } from "../stores/useChatRoomStore";

export default function CurrentChatRoom() {
  const { isCurrentChatRoomOpen } = useChatRoomStore();

  return (
    <div
      className={`absolute z-10 flex h-full w-full items-center justify-center bg-white transition-transform duration-300 ${
        isCurrentChatRoomOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      현재 채팅방
    </div>
  );
}
