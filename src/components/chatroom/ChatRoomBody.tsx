import { useEffect, useRef, useState } from "react";
import { MessageType, PlayerDetailsDto } from "../../types/types";
import ChatRoomTrackInfoMini from "./ChatRoomTrackInfoMini";
import ChatRoomPlaylistOverlay from "./ChatRoomPlaylistOverlay";
import { useStompStore } from "../../stores/useStompStore";
import ChatMessageItem from "./ChatMessageItem";
import { useInView } from "react-intersection-observer";
import { getChatRoomMessages } from "../../utils/apis/serverAPI";
import { Button } from "../Button";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { usePlayerStore } from "../../stores/usePlayerStore";

interface ChatRoomBodyProps {
  chatRoomId: number | null | undefined;
  playerDetails: PlayerDetailsDto | null;
}

export default function ChatRoomBody({
  chatRoomId,
  playerDetails,
}: ChatRoomBodyProps) {
  const { currentPlaylist, currentPlaylistIndex } = usePlayerStore();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false); // 재생목록 표시 여부 상태
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const togglePlaylist = () => setShowPlaylist(!showPlaylist); // 토글 함수
  const { stompClient } = useStompStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { ref: topRef, inView: topInView } = useInView();
  const { ref: bottomRef, inView: bottomInView } = useInView();
  const messageContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (chatRoomId && topInView && hasMoreMessage && !loading) {
      getMoreMessages(chatRoomId, lastMessageId);
    }
  }, [chatRoomId, topInView, hasMoreMessage]);

  const getMoreMessages = async (
    chatRoomId: number,
    lastMessageId: number | null,
  ) => {
    setLoading(true);
    try {
      const response = await getChatRoomMessages(chatRoomId, lastMessageId);

      if (response.length < 20) {
        setHasMoreMessage(false);
      } else if (response.length < 1) {
        return;
      }

      setLastMessageId(response[response.length - 1].messageId);
      setMessages((prevMessages) => [...response.reverse(), ...prevMessages]);
    } catch (e) {
      toast.error("메시지를 불러오는 중 문제가 발생하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 채팅방 메시지 구독하기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!stompClient || !chatRoomId || !accessToken) return;

    const headers = { Authorization: `Bearer ${accessToken}` };

    const callbackMessages = function (message: any) {
      if (message.body) {
        const chatMessage: MessageType = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
        setNewMessageAlert(true);
      }
    };

    stompClient.subscribe(
      `/sub/api/chat/${chatRoomId}`,
      callbackMessages,
      headers,
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      stompClient.unsubscribe(`/sub/api/chat/${chatRoomId}`);
    };
  }, [stompClient, chatRoomId]);

  // 새 메시지 수신 시 스크롤 내리기 (화면 아래로 내린 상태에서만)
  useEffect(() => {
    if (messageContainerRef.current && bottomInView) {
      scrollToBottom();
    }
  }, [messages, bottomInView]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  // 새 메시지 알림 끄기
  useEffect(() => {
    if (bottomInView) setNewMessageAlert(false);
  }, [newMessageAlert, bottomInView]);

  return (
    <div
      className="relative flex h-full flex-col gap-5 overflow-hidden bg-neutral-100"
      ref={chatContainerRef}
    >
      <ChatRoomTrackInfoMini
        track={
          playerDetails
            ? playerDetails.currentPlaylist[playerDetails.currentPlaylistIndex]
            : currentPlaylist[currentPlaylistIndex]
        }
        togglePlaylist={togglePlaylist}
      />
      {chatRoomId && (
        <>
          <ul
            ref={messageContainerRef}
            className="flex flex-col gap-4 overflow-y-scroll px-5 pb-5 pt-24 md:py-5"
          >
            <div ref={topRef}></div>
            {messages.map((message) => (
              <ChatMessageItem message={message} key={message.messageId} />
            ))}
            <div ref={bottomRef}></div>
          </ul>
        </>
      )}
      {newMessageAlert && (
        <div className="absolute bottom-2 flex w-full items-center justify-center">
          <Button
            className="bg-white text-neutral-900 shadow-xl"
            onClick={scrollToBottom}
          >
            <ChevronDown />
          </Button>
        </div>
      )}
      <ChatRoomPlaylistOverlay
        currentPlaylist={playerDetails ? playerDetails.currentPlaylist : currentPlaylist}
        currentPlaylistIndex={playerDetails? playerDetails.currentPlaylistIndex : currentPlaylistIndex}
        show={showPlaylist}
        togglePlaylist={togglePlaylist}
        height={chatContainerRef.current?.clientHeight}
      />
    </div>
  );
}
