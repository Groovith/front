import { useQuery } from "@tanstack/react-query";
import {
  FriendsListResponseDto,
  getFriendsList,
} from "../../utils/apis/friends/getFriendsList.api";
import { Modal } from "../common/Modal";
import { useState } from "react";
import { inviteFriends } from "../../utils/apis/friends/inviteFriends.api";
import { toast } from "sonner";
import H1 from "../common/H1";
import { Button } from "../common/Button";
import { UserDetailsType } from "../../types/types";

interface InvitationModalProps {
  chatRoomId: number | undefined;
  members: UserDetailsType[] | undefined;
  onClose: () => void;
  refetch: () => void;
}

export default function InvitationModal({
  chatRoomId,
  members,
  onClose,
  refetch,
}: InvitationModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const { data } = useQuery<FriendsListResponseDto>({
    queryKey: ["friends"],
    queryFn: getFriendsList,
  });

  const handleUserSelect = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSendInvitations = async () => {
    if (chatRoomId == undefined) return;
    try {
      await inviteFriends(chatRoomId, selectedUsers);
      toast.info("사용자를 초대하였습니다.");
      refetch();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("사용자 초대 중 문제가 발생하였습니다.");
    }
  };

  if (!members) {
    return <></>;
  }

  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="flex flex-col gap-8">
        <H1>친구 초대</H1>
        <div className="flex w-full min-w-[300px] flex-col gap-3">
          {data?.friends &&
            data.friends.length > 0 &&
            data.friends.map((user) => {
              const isMember = members.some((member) => member.id === user.id); // 채팅방에 있는 멤버 확인

              return (
                <div
                  key={user.id}
                  className="flex w-full items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.imageUrl}
                      className={`size-10 rounded-full object-cover ${isMember ? "opacity-40" : ""}`}
                    />
                    <p>{user.username}</p>
                  </div>
                  {/* 둥근 라디오 버튼 */}
                  {!isMember && (
                    <div
                      className={`mr-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 ${
                        selectedUsers.includes(user.id)
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleUserSelect(user.id)}
                    >
                      {/* 선택되었을 때 내부 채우기 */}
                      {selectedUsers.includes(user.id) && (
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <div className="flex w-full gap-3">
          <Button variant={"white"} className="w-full" onClick={onClose}>
            취소
          </Button>
          <Button className="w-full" onClick={handleSendInvitations}>
            초대하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
