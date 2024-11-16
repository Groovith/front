import {
  ArrowLeft,
  Headphones,
  Menu,
  Unplug,
  User,
  UserPlus,
} from "lucide-react";
import { ChatRoomDetailsType, PlayerResponseDto } from "../../types/types";
import { Button } from "../Button";
import DropdownButton from "../DropdownButton";
import {
  joinPlayer,
  leaveChatRoom,
  leavePlayer,
} from "../../utils/apis/serverAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useStompStore } from "../../stores/useStompStore";
import { usePlayer } from "../../hooks/usePlayer";
import { useChatRoomStore } from "../../stores/useChatRoomStore";

interface ChatRoomHeaderProps {
  chatRoomDetails: ChatRoomDetailsType | null;
}

export default function ChatRoomHeader({
  chatRoomDetails,
}: ChatRoomHeaderProps) {
  const { stopPlayer } = usePlayer();
  const {
    player,
    listenTogetherId,
    listenTogetherSubscription,
    setListenTogetherId,
    setPlayerResponseMessage,
    setListenTogetherSubscription,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    setDuration,
    setPaused,
    setPosition,
    setRepeat,
    setPlayerDetails,
  } = usePlayerStore();
  const { stompClient } = useStompStore();
  const { isCurrentChatRoomOpen } = useChatRoomStore();
  const navigate = useNavigate();
  const handleLeaveChatRoom = async (chatRoomId: number) => {
    try {
      await leaveChatRoom(chatRoomId);
      navigate("/chat");
    } catch (e) {
      console.error("채팅방 나가기 중 오류 발생: ", e);
      toast.error("채팅방 나가기 중 오류가 발생하였습니다.");
    }
  };

  // 같이 듣기 연결
  const connectListenTogether = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !stompClient || !chatRoomDetails) return;

    // 기존에 구독한 같이 듣기가 있다면 구독 해제 & 같이 듣기 연결 상태 해제
    if (
      listenTogetherId !== chatRoomDetails.chatRoomId &&
      listenTogetherSubscription
    ) {
      listenTogetherSubscription.unsubscribe();
      setListenTogetherId(null);
    }

    try {
      // 채팅방 참가
      const response = await joinPlayer(chatRoomDetails.chatRoomId);
      setPlayerDetails(response);
      console.log(response);

      setRepeat(response.repeat);
      setCurrentPlaylist(response.currentPlaylist);
      setCurrentPlaylistIndex(response.currentPlaylistIndex);

      const videoId =
        response.currentPlaylist[response.currentPlaylistIndex].videoId;
      const position = response.position;
      const paused = response.paused;

      if (!player?.current) return;
      if (paused) {
        player.current.target.cueVideoById({
          videoId: videoId,
          startSeconds: position,
        });
      } else {
        player.current.target.loadVideoById({
          videoId: videoId,
          startSeconds: position,
        });
      }
    } catch (e) {
      toast.error("같이 듣기 참가 중 문제가 발생하였습니다.");
    }

    // STOMP 커스텀 헤더
    const headers = { Authorization: `Bearer ${accessToken}` };

    // 같이 듣기 콜백 함수
    const callback = async function (message: any) {
      if (message.body) {
        const playerMessage: PlayerResponseDto = JSON.parse(message.body);
        // playerStore의 전역 변수에 저장하고 Player 컴포넌트에서 비교
        setPlayerResponseMessage(playerMessage);
      }
    };

    // STOMP 토픽 구독
    const subscription = stompClient.subscribe(
      `/sub/api/chatrooms/${chatRoomDetails.chatRoomId}/player/listen-together`,
      callback,
      headers,
    );

    setListenTogetherId(chatRoomDetails.chatRoomId);
    setListenTogetherSubscription(subscription);
  };

  // 같이 듣기 연결 해제
  const disconnectListenTogether = () => {
    if (
      !chatRoomDetails ||
      !listenTogetherSubscription ||
      !listenTogetherId ||
      chatRoomDetails.chatRoomId !== listenTogetherId
    )
      return;

    leavePlayer(chatRoomDetails.chatRoomId);
    listenTogetherSubscription.unsubscribe();
    setListenTogetherId(null);
    setCurrentPlaylist([]);
    setCurrentPlaylistIndex(0);
    setPaused(true);
    setRepeat(false);
    stopPlayer();
    setPosition(0);
    setDuration(0);
  };

  return (
    <div className="flex h-[100px] items-center justify-between border-b px-2">
      {chatRoomDetails ? (
        <>
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              className="mr-2 p-2"
              onClick={() => navigate("/chat")}
              disabled={isCurrentChatRoomOpen}
            >
              <ArrowLeft />
            </Button>

            <img
              src={chatRoomDetails.imageUrl}
              className="mr-3 size-12 rounded-full"
            ></img>
            <div className="flex flex-col justify-start gap-2">
              <h1>{chatRoomDetails?.name}</h1>
              <Button
                variant={"transparent"}
                className="flex w-fit items-center gap-1 p-0 text-sm text-neutral-500"
              >
                <User size={15} />0
              </Button>
            </div>
          </div>
          <div className="flex">
            <Button variant={"ghost"}>
              <UserPlus />
            </Button>
            {listenTogetherId &&
            listenTogetherId === chatRoomDetails.chatRoomId ? (
              <Button variant={"ghost"} onClick={disconnectListenTogether}>
                <Unplug />
              </Button>
            ) : (
              <Button variant={"ghost"} onClick={connectListenTogether}>
                <Headphones />
              </Button>
            )}

            <DropdownButton
              items={[
                {
                  label: "채팅방 나가기",
                  action: () => {
                    handleLeaveChatRoom(chatRoomDetails.chatRoomId);
                  },
                },
              ]}
            >
              <Button variant={"ghost"}>
                <Menu />
              </Button>
            </DropdownButton>
          </div>
        </>
      ) : (
        <span className="flex h-full w-full items-center justify-start px-5 text-sm text-neutral-400">
          참여 중인 채팅방이 없습니다.
        </span>
      )}
    </div>
  );
}
