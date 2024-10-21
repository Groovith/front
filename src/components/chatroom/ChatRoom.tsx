import ChatRoomHeader from "./ChatRoomHeader";
import { useEffect, useState } from "react";
import { ChatRoomDetailsType, MessageType } from "../../types/types";
import { getChatRoomDetails } from "../../utils/apis/serverAPI";
import { toast } from "sonner";
import ChatRoomBody from "./ChatRoomBody";
import ChatRoomInput from "./ChatRoomInput";
import { useStompStore } from "../../stores/useStompStore";

interface ChatRoomProps {
  chatRoomId: string | undefined;
}

export default function ChatRoom({ chatRoomId }: ChatRoomProps) {
  const { stompClient } = useStompStore();
  const [chatRoomDetails, setChatRoomDetails] =
    useState<ChatRoomDetailsType | null>();
  const [chatRoomMessages, setChatRoomMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    handleGetChatRoomDetails();
  }, [chatRoomId]);

  // 채팅방 정보 조회
  const handleGetChatRoomDetails = async () => {
    if (!chatRoomId) return;

    try {
      const response = await getChatRoomDetails(chatRoomId);
      setChatRoomDetails(response);
    } catch (e) {
      console.error("채팅방 정보 조회 중 에러: ", e);
      toast.error("채팅방 정보를 불러오는 중 문제가 발생하였습니다.");
    }
  };

  // 채팅방 구독하기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!stompClient || !chatRoomId || !accessToken) return;

    const headers = { Authorization: `Bearer ${accessToken}` };
    const callback = function (message: any) {
      if (message.body) {
        const chatMessage: MessageType = JSON.parse(message.body);
        setChatRoomMessages((prevMessages) => [...prevMessages, chatMessage]);
      }
    };
    stompClient.subscribe(`/sub/api/chat/${chatRoomId}`, callback, headers);

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      stompClient.unsubscribe(`/sub/api/chat/${chatRoomId}`);
    };
  }, [stompClient, chatRoomId]);

  if (!chatRoomDetails) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
        잘못된 접근입니다.
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col border-r">
      <ChatRoomHeader chatRoomDetails={chatRoomDetails} />
      <ChatRoomBody chatRoomMessages={chatRoomMessages} />
      <ChatRoomInput chatRoomId={chatRoomId} />
    </div>
  );
}
