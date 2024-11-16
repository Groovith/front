import { useNavigate } from "react-router-dom";
import { UserDetailsType } from "../../types/types";
import { EllipsisVertical, UserX } from "lucide-react";
import { Button } from "../common/Button";
import DropdownButton, { DropdownItem } from "../common/DropdownButton";
import { deleteFriend } from "../../utils/apis/friends/deleteFriend.api";
import { toast } from "sonner";

interface FriendItemProps {
  user: UserDetailsType;
  refetch: () => void;
}

export default function FriendItem({ user, refetch }: FriendItemProps) {
  const navigate = useNavigate();

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(user.username);
      refetch();
    } catch (e) {
        toast.error("친구 삭제 중 문제가 발생하였습니다.");
        console.error(e);
    }
  };

  const moreButtonItems: DropdownItem[] = [
    {
      Icon: UserX,
      label: "친구 삭제",
      action: handleDeleteFriend,
    },
  ];

  return (
    <Button
      key={user.id}
      variant={"ghost"}
      className="flex w-full cursor-default items-center justify-between rounded-lg"
      onClick={() => navigate(`/user/${user.username}`)}
    >
      <div className="flex items-center gap-3">
        <img
          src={user.imageUrl}
          alt="profile"
          className="size-12 rounded-full object-cover"
        />
        <p>{user.username}</p>
      </div>
      <DropdownButton items={moreButtonItems}>
        <Button variant={"transparent"}>
          <EllipsisVertical />
        </Button>
      </DropdownButton>
    </Button>
  );
}
