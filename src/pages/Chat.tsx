import { useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChatRoom,
  fetchChatRooms,
  leaveChatRoom,
} from "../utils/apis/serverAPI";
import { ChatRoomDetailsType } from "../types/types";
import Loading from "./Loading";
import ChatRoomListItem from "../components/chat/ChatRoomListItem";

export default function Chat() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatRoomList, setChatRoomList] = useState<ChatRoomDetailsType[]>([]);
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const navigate = useNavigate();

  const { isLoading } = useQuery<{
    chatRooms: ChatRoomDetailsType[];
  }>({
    queryKey: ["chatRooms"],
    queryFn: () =>
      fetchChatRooms().then((data) => {
        setChatRoomList(data.chatRooms);
        return data;
      }),
  });

  const { mutate: createChatRoomMutate } = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (data) => {
      navigate(`/chat/${data.chatRoomId}`);
    },
  });

  const handleCreateNewChatRoom = () => {
    if (newChatRoomName.trim()) {
      createChatRoomMutate({ name: newChatRoomName });
    } else {
      alert("채팅방 이름을 입력해주세요.");
    }
    setIsModalOpen(false);
  };

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
      <div className="flex size-full justify-center px-10 py-16">
        <div className="flex size-full max-w-screen-sm flex-col gap-5">
          <ChatHeader setIsModalOpen={setIsModalOpen} />

          {chatRoomList && chatRoomList.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-neutral-400">
                아직 참여한 채팅이 없어요
              </p>
            </div>
          )}

          {chatRoomList && chatRoomList.length > 0 && (
            <ul className="flex flex-col">
              {chatRoomList.map((chatRoom) => (
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
        <Modal onClose={() => setIsModalOpen(false)} closeOnOutsideClick={true}>
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-2xl font-bold">새 채팅방 생성</h1>
          </div>
          <input
            type="text"
            className="mb-10 w-full rounded-md border border-neutral-400 p-2 placeholder:text-neutral-500"
            placeholder="채팅방 이름"
            value={newChatRoomName}
            onChange={(e) => setNewChatRoomName(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <Button
              variant={"ghost"}
              onClick={() => setIsModalOpen(false)}
              className="w-full border px-5"
            >
              취소
            </Button>
            <Button onClick={handleCreateNewChatRoom} className="w-full px-5">
              만들기
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
