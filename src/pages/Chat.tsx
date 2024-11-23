import { useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchChatRooms,
  leaveChatRoom,
} from "../utils/apis/serverAPI";
import { ChatRoomDetailsType } from "../types/types";
import Loading from "./Loading";
import ChatRoomListItem from "../components/chat/ChatRoomListItem";
import CreateChatRoomModal from "../components/chat/CreateChatRoomModal";

export default function Chat() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{
    chatRooms: ChatRoomDetailsType[];
  }>({
    queryKey: ["chatRooms"],
    queryFn: () => fetchChatRooms(),
  });

  const handleChatRoomClick = (chatRoomId: number) => {
    navigate(`/chat/${chatRoomId}`);
  };

  // 채팅방 나가기 Mutation
  const { mutate: leaveChatRoomMutate } = useMutation({
    mutationFn: leaveChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      navigate("/chat");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex size-full overflow-y-auto justify-center px-10 pt-16 ">
        <div className="flex size-full max-w-screen-sm flex-col gap-5">
          <ChatHeader setIsModalOpen={setIsModalOpen} />

          {data?.chatRooms && data.chatRooms.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-neutral-400">
                아직 참여한 채팅방이 없어요.
              </p>
            </div>
          )}

          {data?.chatRooms && data.chatRooms.length > 0 && (
            <ul className="flex flex-col pb-10 w-full">
              {data.chatRooms.map((chatRoom) => (
                <ChatRoomListItem
                  key={chatRoom.chatRoomId}
                  chatRoom={chatRoom}
                  handleChatRoomClick={handleChatRoomClick}
                  leaveChatRoomMutate={leaveChatRoomMutate}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreateChatRoomModal onClose={() => setIsModalOpen(false)}/>
      )}
    </>
  );
}
