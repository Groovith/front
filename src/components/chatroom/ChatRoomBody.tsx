import { useRef, useState } from "react";
import { MessageType } from "../../types/types";
import { formatDateTime } from "../../utils/formatDateTime";
import ChatRoomTrackInfoMini from "./ChatRoomTrackInfoMini";
import ChatRoomPlaylistOverlay from "./ChatRoomPlaylistOverlay";

interface ChatRoomBodyProps {
  chatRoomMessages: MessageType[];
}

export default function ChatRoomBody({ chatRoomMessages }: ChatRoomBodyProps) {
  const [showPlaylist, setShowPlaylist] = useState(false); // 재생목록 표시 여부 상태
  const togglePlaylist = () => setShowPlaylist(!showPlaylist); // 토글 함수
  const chatContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="relative flex h-full flex-col gap-5 overflow-auto bg-neutral-100"
      ref={chatContainerRef}
    >
      <ChatRoomTrackInfoMini
          track={{
            videoId: "a",
            imageUrl:
              "https://lh3.googleusercontent.com/fzTTy3sCa32fBVqafRTKZn_z70NXVxC0jj05kIMgHIOyN4d0I5AudOYuTE4ov7cLiwN5wOpOS8OwZjBuuQ=w544-h544-l90-rj",
            title: "APT.",
            duration: 0,
            artist: "Rose",
          }}
          togglePlaylist={togglePlaylist}
        />
      <ul className="flex flex-col gap-4 pt-24 md:py-5 px-5">
        {chatRoomMessages &&
          chatRoomMessages.map((message) => (
            <li key={message.messageId} className="flex gap-3">
              <img src={message.imageUrl} className="size-10 rounded-full" />
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
          ))}
      </ul>
      <ChatRoomPlaylistOverlay show={showPlaylist} togglePlaylist={togglePlaylist} height={chatContainerRef.current?.clientHeight} />
    </div>
  );
}
