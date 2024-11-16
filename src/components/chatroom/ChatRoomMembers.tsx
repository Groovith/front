import { User } from "lucide-react";
import { useState } from "react";
import { UserDetailsType } from "../../types/types";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { useNavigate } from "react-router-dom";

interface ChatRoomMembersProps {
  members: UserDetailsType[];
}

export default function ChatRoomMembers({ members }: ChatRoomMembersProps) {
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
