import { Crown, Plus, User } from "lucide-react";
import { useState } from "react";
import { UserDetailsType } from "../../types/types";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { useNavigate } from "react-router-dom";

interface ChatRoomMembersProps {
  members: UserDetailsType[];
  masterId: number;
  openInvitationModal: () => void;
}

export default function ChatRoomMembers({
  members,
  masterId,
  openInvitationModal,
}: ChatRoomMembersProps) {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

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
                  className="flex min-w-[300px] cursor-default items-center justify-between rounded-lg"
                  key={member.id}
                  onClick={() => navigate(`/user/${member.username}`)}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={member.imageUrl}
                      alt="profile"
                      className="size-12 rounded-full object-cover"
                    />
                    <p>{member.username}</p>
                  </div>
                  {masterId === member.id ? <div className="text-neutral-500"><Crown size={20} /></div> : <div></div>}
                </Button>
              ))}
            <Button
              variant={"white"}
              className="mx-2 mt-5 flex items-center justify-center gap-2"
              onClick={() => {
                setModalOpen(false);
                openInvitationModal();
              }}
            >
              <Plus size={18} />
              <p>채팅에 초대하기</p>
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
