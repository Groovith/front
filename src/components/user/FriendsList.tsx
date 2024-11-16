import { UserPlus } from "lucide-react";
import { Button } from "../common/Button";
import { useState } from "react";
import {
  FriendsListResponseDto,
  getFriendsList,
} from "../../utils/apis/friends/getFriendsList.api";
import AddFriendModal from "./AddFriendModal";
import { useQuery } from "@tanstack/react-query";
import FriendItem from "./FriendItem";

export default function FriendsList() {
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const { data, refetch } = useQuery<FriendsListResponseDto>({
    queryKey: ["friends"],
    queryFn: () => getFriendsList(),
  });

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex w-full items-center justify-between">
        <h1 className="text-xl font-bold">친구</h1>
        <Button variant={"ghost"} onClick={() => setAddFriendModalOpen(true)}>
          <UserPlus />
        </Button>
      </div>
      <div className="flex w-full flex-col">
        {data &&
          data.friends.length > 0 &&
          data.friends.map((user) => (
            <FriendItem user={user} refetch={refetch} />
          ))}
      </div>
      {isAddFriendModalOpen && (
        <AddFriendModal
          onClose={() => setAddFriendModalOpen(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
