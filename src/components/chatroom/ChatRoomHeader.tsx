import { ChevronLeft, HeadphoneOff, Headphones } from "lucide-react";
import {
  ChatRoomDetailsType,
  PlayerResponseDto,
  UserDetailsType,
} from "../../types/types";
import { Button } from "../common/Button";
import {
  getChatRoomMembers,
  joinPlayer,
  leavePlayer,
} from "../../utils/apis/serverAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useStompStore } from "../../stores/useStompStore";
import { usePlayer } from "../../hooks/usePlayer";
import { useChatRoomStore } from "../../stores/useChatRoomStore";
import ChatRoomMembers from "./ChatRoomMembers";
import ChatRoomHeaderDropdownButton from "./ChatRoomHeaderDropdownButton";
import InvitationModal from "./InvitationModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ButtonWithText } from "../common/ButtonWithText";

interface ChatRoomHeaderProps {
  chatRoomDetails: ChatRoomDetailsType | undefined;
  refetchChatRoom: () => void;
}

export default function ChatRoomHeader({
  chatRoomDetails,
  refetchChatRoom,
}: ChatRoomHeaderProps) {
  const [isInvitationModalOpen, setInvitationModalOpen] = useState(false);
  //const [members, setMembers] = useState<UserDetailsType[]>([]);
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

      setRepeat(response.repeat);
      setCurrentPlaylist(response.currentPlaylist);
      setCurrentPlaylistIndex(response.currentPlaylistIndex);

      if (
        response.currentPlaylist[response.currentPlaylistIndex] !== undefined
      ) {
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
      }
      toast.message("같이 듣기에 참가합니다.");
    } catch (e) {
      console.error(e);
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
    toast.message("같이 듣기 연결을 해제합니다.");
  };

  /**
   * 채팅방 유저 목록 불러오기
   */
  const { data: members, refetch } = useQuery<UserDetailsType[]>({
    queryKey: ["members", chatRoomDetails?.chatRoomId],
    queryFn: () => getChatRoomMembers(chatRoomDetails?.chatRoomId as number),
    enabled: typeof chatRoomDetails?.chatRoomId === "number",
  });

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
              <ChevronLeft />
            </Button>

            <img
              src={chatRoomDetails.imageUrl}
              className="mr-3 size-12 rounded-full object-cover flex-none"
            ></img>
            <div className="flex flex-col justify-start gap-2 w-full truncate">
              <h1 className="w-full truncate">{chatRoomDetails?.name}</h1>
              <div className="flex items-center gap-5">
                <ChatRoomMembers
                  members={members}
                  masterId={chatRoomDetails.masterUserId}
                  openInvitationModal={() => {
                    setInvitationModalOpen(true);
                  }}
                />
                <div className="flex gap-2 text-xs text-neutral-500">
                  <p>플레이어 권한:</p>
                  <p>
                    {chatRoomDetails.permission === "MASTER"
                      ? "방장만"
                      : "모두"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            {listenTogetherId &&
            listenTogetherId === chatRoomDetails.chatRoomId ? (
              <ButtonWithText
                onClick={disconnectListenTogether}
                Icon={HeadphoneOff}
                text="연결 해제"
              />
            ) : (
              <ButtonWithText
                onClick={connectListenTogether}
                Icon={Headphones}
                text="같이 듣기"
              />
            )}
            <ChatRoomHeaderDropdownButton
              chatRoomDetails={chatRoomDetails}
              openInvitationModal={() => setInvitationModalOpen(true)}
              refetch={refetchChatRoom}
            />
          </div>
          {isInvitationModalOpen && (
            <InvitationModal
              chatRoomId={chatRoomDetails.chatRoomId}
              members={members}
              onClose={() => setInvitationModalOpen(false)}
              refetch={refetch}
            />
          )}
        </>
      ) : (
        <span className="flex h-full w-full items-center justify-start px-5 text-sm text-neutral-400">
          참여 중인 채팅방이 없습니다.
        </span>
      )}
    </div>
  );
}
