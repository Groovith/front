import { ChatRoomDetailsType } from "../../types/types";
import { useState } from "react";
import ChatRoomDetailsModal from "./ChatRoomDetailsModal";

interface ChatRoomListItemProps {
  chatRoom: ChatRoomDetailsType;
}

export default function ChatRoomSearchItem({
  chatRoom,
}: ChatRoomListItemProps) {
  const [isChatRoomDetailsModalOpen, setChatRoomDetailsModalOpen] =
    useState(false);

  return (
    <>
      <li
        key={chatRoom.chatRoomId}
        className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-4 text-left hover:bg-neutral-100"
        onClick={() => {
          setChatRoomDetailsModalOpen(true);
        }}
      >
        <div className="flex items-center gap-5 hover:cursor-pointer">
          <img
            src={chatRoom.imageUrl}
            className="size-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-neutral-400">
              <p className="text-sm">
                {chatRoom.masterUserName
                  ? chatRoom.masterUserName
                  : "알 수 없음"}
              </p>
            </div>
            <h2 className="text-neutral-900">{chatRoom.name}</h2>
          </div>
        </div>
      </li>
      {isChatRoomDetailsModalOpen && (
        <ChatRoomDetailsModal
          onClose={() => setChatRoomDetailsModalOpen(false)}
          chatRoom={chatRoom}
        />
      )}
    </>
  );
}
