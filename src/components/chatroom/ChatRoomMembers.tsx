import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { UserDetailsType } from "../../types/types";
import { getChatRoomMembers } from "../../utils/apis/serverAPI";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { useNavigate } from "react-router-dom";

interface ChatRoomMembersProps {
  chatRoomId: string | number | undefined;
}

export default function ChatRoomMembers({ chatRoomId }: ChatRoomMembersProps) {
  const navigate = useNavigate();
  const [members, setMembers] = useState<UserDetailsType[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  /**
   * 채팅방 유저 목록 불러오기
   */
  const fetchChatRoomMembers = async () => {
    if (chatRoomId == undefined) return;
    try {
      const response = await getChatRoomMembers(chatRoomId);
      setMembers(response.data);
    } catch (e) {
      console.error("채팅방 멤버 로딩 중 에러: ", e);
    }
  };

  useEffect(() => {
    if (chatRoomId === undefined) return;
    fetchChatRoomMembers();
  }, [chatRoomId]);

  return (
    <>
      <Button
        variant={"transparent"}
        className="flex w-fit items-center gap-1 p-0 text-sm text-neutral-500"
        onClick={() => setModalOpen(true)}
      >
        <User size={15} />
        <p>{members.length}</p>
      </Button>
      {isModalOpen && (
        <Modal closeOnOutsideClick={true} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col">
            {members &&
              members.length > 0 &&
              members.map((member) => (
                <Button
                    variant={"ghost"}
                  className="flex gap-5 px-5 min-w-[300px] justify-start items-center rounded-lg cursor-default"
                  key={member.id}
                  onClick={() => navigate(`/user/${member.username}`)}
                >
                  <img
                    src={member.imageUrl}
                    alt="profile"
                    className="size-10 object-cover rounded-full"
                  />
                  <p>{member.username}</p>
                </Button>
              ))}
          </div>
        </Modal>
      )}
    </>
  );
}
