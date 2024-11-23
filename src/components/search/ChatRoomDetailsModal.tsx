import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatRoomDetailsType, PlayerDetailsDto } from "../../types/types";
import { getPlayer, joinChatRoom } from "../../utils/apis/serverAPI";
import { Modal } from "../common/Modal";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { Button } from "../common/Button";
import ChatRoomDetailsPlaylistItem from "./ChatRoomDetailsPlaylistIem";

interface ChatRoomDetailsModalProps {
  onClose: () => void;
  chatRoom: ChatRoomDetailsType;
}

export default function ChatRoomDetailsModal({
  onClose,
  chatRoom,
}: ChatRoomDetailsModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 채팅방 참가 요청
  const { mutate } = useMutation({
    mutationFn: joinChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      navigate(`/chat/${chatRoom.chatRoomId}`);
    },
  });

  const { data: playerDetails } = useQuery<PlayerDetailsDto>({
    queryKey: ["playlist", chatRoom.chatRoomId],
    queryFn: () => getPlayer(chatRoom.chatRoomId),
  });

  // 채팅방 참가 클릭 시
  const handleChatRoomEnter = () => {
    mutate(chatRoom.chatRoomId);
  };

  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="flex flex-col gap-10">
        <div className="flex h-fit w-full gap-3">
          <img
            src={chatRoom.imageUrl}
            className="size-20 rounded-full object-cover"
          />
          <div className="flex w-full flex-col gap-1">
            <p>{chatRoom.name}</p>
            <div className="flex w-full justify-between gap-1 text-sm text-neutral-500">
              <p>방장</p>
              {chatRoom.masterUserName}
            </div>
            <div className="flex w-full justify-between gap-1 text-sm text-neutral-500">
              <p>플레이어 권한</p>
              <p>{chatRoom.permission == "EVERYONE" ? "방장만" : "모두"}</p>
            </div>
          </div>
        </div>
        <div className="flex max-h-[300px] w-[300px] flex-col overflow-y-auto">
          {playerDetails?.currentPlaylist &&
          playerDetails?.currentPlaylist.length > 0 ? (
            playerDetails.currentPlaylist.map((track, index) => (
              <ChatRoomDetailsPlaylistItem
                key={index}
                track={track}
                index={index}
                isCurrentTrack={index === playerDetails.currentPlaylistIndex}
              />
            ))
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-neutral-400">
              <Music />
              <p>플레이리스트가 비어있습니다.</p>
            </div>
          )}
        </div>
        <Button className="w-full rounded-xl" onClick={handleChatRoomEnter}>
          채팅방 참가
        </Button>
      </div>
    </Modal>
  );
}
