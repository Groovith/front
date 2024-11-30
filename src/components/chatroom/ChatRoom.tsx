import ChatRoomMain from "./ChatRoomMain";
import ChatRoomPlayer from "./ChatRoomPlayer";
import { useEffect, useState } from "react";
import { ChatRoomDetailsType, PlayerDetailsDto } from "../../types/types";
import { useStompStore } from "../../stores/useStompStore";
import { getChatRoomDetails, getPlayer } from "../../utils/apis/serverAPI";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ChatRoomProps {
  chatRoomId: number | null | undefined;
}

// chatRoomId 여부에 따라 채팅방 | 로컬 여부 판단
// 로컬의 경우 null의 chatRoomDetails와 playerDetails 전달
// chatRoomId로 데이터 불러오고 STOMP Client 연결 (채팅 + 플레이어) -> chatRoomId가 바뀔 때마다

export default function ChatRoom({ chatRoomId }: ChatRoomProps) {
  const [playerDetails, setPlayerDetails] = useState<PlayerDetailsDto | null>(
    null,
  );
  const { stompClient } = useStompStore();

  useEffect(() => {
    if (!chatRoomId) {
      return;
    }
    handleGetPlayerDetails();
  }, [chatRoomId]);

  // 채팅방 정보 조회
  const { data: chatRoomDetails, refetch: refetchChatRoom } = useQuery<ChatRoomDetailsType | undefined>({
    queryKey: ["chatRoom", chatRoomId],
    queryFn: () => getChatRoomDetails(chatRoomId),
    enabled: typeof chatRoomId === "number",
  });

  // 채팅방 플레이어 정보 조회
  const handleGetPlayerDetails = async () => {
    if (!chatRoomId) return;

    try {
      const response = await getPlayer(chatRoomId);
      setPlayerDetails(response);
    } catch (e) {
      console.error("플레이어 정보 조회 중 에러: ", e);
      toast.error("플레이어 정보를 불러오는 중 문제가 발생하였습니다.");
    }
  };

  // 채팅방 플레이어 구독하기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!stompClient || !chatRoomId || !accessToken) return;

    const headers = { Authorization: `Bearer ${accessToken}` };

    const callbackPlayer = function (message: any) {
      if (message.body) {
        const playerMessage: PlayerDetailsDto = JSON.parse(message.body);
        setPlayerDetails(playerMessage);
      }
    };

    stompClient.subscribe(
      `/sub/api/chatrooms/${chatRoomId}/player`,
      callbackPlayer,
      headers,
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      stompClient.unsubscribe(`/sub/api/chatrooms/${chatRoomId}/player`);
    };
  }, [stompClient, chatRoomId]);

  return (
    <div className="flex size-full">
      <ChatRoomMain
        chatRoomId={chatRoomId}
        chatRoomDetails={chatRoomDetails}
        refetchChatRoom={refetchChatRoom}
        playerDetails={playerDetails}
      />
      <div className="hidden w-full max-w-[400px] md:flex">
        <ChatRoomPlayer playerDetails={playerDetails} chatRoomDetails={chatRoomDetails} />
      </div>
    </div>
  );
}
