import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ChatRoomDetailsType, MessageType } from "../utils/types";
import {
  getChatRoomDetails,
  getChatRoomMessages,
} from "../utils/apis/serverAPI";
import defaultChatRoomImage from "../assets/default-image-mountain.png";
import defaultUserImage from "../assets/default-user-image.png";
import { Button } from "./Button";
import { Menu, SendHorizonal, UserPlus } from "lucide-react";
import Loading from "../pages/Loading";
import DropdownButton from "./DropdownButton";
import React, { useEffect, useRef, useState } from "react";
import { useStompStore } from "../stores/useStompStore";
import { useUser } from "../hooks/useUser";
import { useChatRoomStore } from "../stores/useChatRoomStore";

export function ChatRoom() {
  const { chatRoomId } = useParams(); // 현재 주소 파라미터에서. "/chat/:chatRoomId".
  const [message, setMessage] = useState(""); // 입력창 메시지
  const [chatRoomMessages, setChatRoomMessages] = useState<MessageType[]>([]);
  const { stompClient } = useStompStore();
  const {
    getChatRoomById,
    currentChatRoomId,
    currentChatRoomMessages,
    setCurrentChatRoomId,
    setCurrentChatRoomMessages,
    newMessage,
    addToCurrentChatRoomMessages,
  } = useChatRoomStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 현재 채팅방 정보를 가져옴 -> 없는 경우?
  const chatRoomDetails = getChatRoomById(Number(chatRoomId));
  if (!chatRoomDetails) {
    return <div className="flex w-full h-full justify-center items-center text-sm text-neutral-400">여긴 어디죠?</div>;
  }

  // 현재 채팅방 아이디 업데이트
  useEffect(() => {
    if (chatRoomId) {
      setCurrentChatRoomId(Number(chatRoomId));
    } else {
      setCurrentChatRoomId(-1);
    }

    return () => {
      setCurrentChatRoomId(-1);
    };
  }, [chatRoomId]);

  // 새 메시지가 현재 채팅방 메시지이면 추가
  useEffect(() => {
    if (
      newMessage &&
      chatRoomId &&
      newMessage.chatRoomId == Number(chatRoomId)
    ) {
      addToCurrentChatRoomMessages(newMessage);
    }
  }, [newMessage]);

  // 채팅방 메시지 불러오기
  const { isLoading: isMessagesLoading } = useQuery<{
    data: MessageType[];
  }>({
    queryKey: ["messages", chatRoomId],
    queryFn: () =>
      getChatRoomMessages(chatRoomId as string).then((data) => {
        setCurrentChatRoomMessages(data.data);
        console.log(data.data);
        return data;
      }),
    enabled: !!chatRoomId,
  });

  // 채팅방 플레이리스트 불러오기

  // 메시지 보내기
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(currentChatRoomId);
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

  // 채팅방 들어가면 아래로 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  // 새 메시지 생기면 아래로 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentChatRoomMessages]);

  if (isMessagesLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex w-full flex-col border-r">
        <div className="flex h-[100px] items-center justify-between border-b px-8">
          <div className="flex items-center gap-5">
            <img
              src={defaultChatRoomImage}
              className="size-14 rounded-full"
            ></img>
            <h1>{chatRoomDetails?.name}</h1>
          </div>
          <div className="flex">
            <Button variant={"ghost"}>
              <UserPlus />
            </Button>
            <DropdownButton
              items={[{ label: "채팅방 나가기", action: () => {} }]}
            >
              <Button variant={"ghost"}>
                <Menu />
              </Button>
            </DropdownButton>
          </div>
        </div>
        <div
          className="flex h-full flex-col gap-5 overflow-auto bg-neutral-50 px-5 py-5"
          ref={chatContainerRef}
        >
          {currentChatRoomMessages &&
            currentChatRoomMessages.map((message) => (
              <div key={message.messageId} className="flex gap-3">
                <img src={defaultUserImage} className="size-10" />
                <div className="flex flex-col gap-1">
                  <p>{message.username}</p>
                  <p className="flex justify-start rounded-lg bg-white px-3 py-2 shadow-lg">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="flex h-[100px] items-center justify-between border-t px-4">
          <form
            className="flex w-full justify-between gap-2"
            onSubmit={sendMessage}
          >
            <input
              className="w-full flex-grow rounded-lg p-2 placeholder:text-neutral-400 focus:outline-none"
              type="text"
              placeholder="메시지를 입력하세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="ghost">
              <SendHorizonal />
            </Button>
          </form>
        </div>
      </div>
      <div className="flex w-[400px] flex-col"></div>
    </div>
  );
}
