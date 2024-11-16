import { useEffect, useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChatRoomPlayerPermissionType,
  ChatRoomVisibilityType,
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
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const [chatRoomVisibility, setChatRoomVisibility] =
    useState<ChatRoomVisibilityType>("PUBLIC");
  const [musicPlayerPermission, setMusicPlayerPermission] =
    useState<ChatRoomPlayerPermissionType>("EVERYONE");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{
    chatRooms: ChatRoomDetailsType[];
  }>({
    queryKey: ["chatRooms"],
    queryFn: () => fetchChatRooms(),
  });

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  const { mutate: createChatRoomMutate } = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (data) => {
      navigate(`/chat/${data.chatRoomId}`);
    },
  });

  const handleCreateNewChatRoom = () => {
    if (newChatRoomName.trim()) {
      createChatRoomMutate({
        name: newChatRoomName,
        status: chatRoomVisibility,
        permission: musicPlayerPermission,
      });
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

          {data?.chatRooms && data.chatRooms.length === 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-neutral-400">
                아직 참여한 채팅이 없어요
              </p>
            </div>
          )}

          {data?.chatRooms && data.chatRooms.length > 0 && (
            <ul className="flex flex-col">
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
        <Modal onClose={() => setIsModalOpen(false)} closeOnOutsideClick={true}>
          <div className="flex h-full w-full flex-col">
            <div className="mb-10 flex items-center justify-between">
              <h1 className="text-2xl font-bold">새 채팅방 생성</h1>
            </div>

            {/* 채팅방 이름 입력 */}
            <input
              type="text"
              className="mb-6 w-full rounded-md border border-neutral-400 p-2 placeholder:text-neutral-500"
              placeholder="채팅방 이름"
              value={newChatRoomName}
              onChange={(e) => setNewChatRoomName(e.target.value)}
            />

            {/* 채팅방 공개 여부 선택 */}
            <div className="mb-6">
              <p className="mb-3 font-medium">채팅방 공개 여부</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={chatRoomVisibility === "PUBLIC"}
                    onChange={() => setChatRoomVisibility("PUBLIC")}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex flex-col justify-start gap-1">
                    <span className="font-medium">공개</span>
                    <p className="text-xs font-normal text-gray-500">
                      검색을 통해 채팅방을 찾을 수 있고, 참여할 수 있습니다.
                    </p>
                  </div>
                </label>
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={chatRoomVisibility === "PRIVATE"}
                    onChange={() => setChatRoomVisibility("PRIVATE")}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex flex-col justify-start gap-1">
                    <span className="font-medium">비공개</span>
                    <p className="text-xs font-normal text-gray-500">
                      검색을 통해 채팅방을 찾을 수 없으며, 초대를 통해서만
                      참여할 수 있습니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 음악 플레이어 권한 선택 */}
            <div className="mb-6">
              <p className="mb-3 font-medium">음악 플레이어 권한</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="permission"
                    value="EVERYONE"
                    checked={musicPlayerPermission === "EVERYONE"}
                    onChange={() => setMusicPlayerPermission("EVERYONE")}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex flex-col justify-start gap-1">
                    <span className="font-medium">모두</span>
                    <p className="text-xs font-normal text-gray-500">
                      채팅방에 참가한 모든 사용자가 음악을 정지/재생,
                      추가/삭제할 수 있습니다.
                    </p>
                  </div>
                </label>
                <label className="flex items-start">
                  <input
                    type="radio"
                    name="permission"
                    value="MASTER"
                    checked={musicPlayerPermission === "MASTER"}
                    onChange={() => setMusicPlayerPermission("MASTER")}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3 flex flex-col justify-start gap-1">
                    <span className="font-medium">방장만</span>
                    <p className="text-xs font-normal text-gray-500">
                      채팅방 방장만 음악을 정지/재생, 추가/삭제할 수 있습니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 버튼들 */}
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
          </div>
        </Modal>
      )}
    </>
  );
}
