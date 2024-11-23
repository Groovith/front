import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { EllipsisVertical, UserPlus } from "lucide-react";
import { searchChatRooms, searchUsers } from "../../utils/apis/serverAPI";
import DropdownButton from "../common/DropdownButton";
import ChatRoomSearchItem from "./ChatRoomSearchItem";

export function SearchResults() {
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("query");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  // 유저 검색
  const { data: userData } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query || ""),
    enabled: !!query,
  });

  // 채팅방 검색
  const { data: chatRoomData } = useQuery({
    queryKey: ["searchChatRooms", query],
    queryFn: () => searchChatRooms(query || ""),
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-neutral-400">원하는 컨텐츠를 찾아보세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col">
        <h1 className="mb-4 px-3 text-2xl font-bold text-neutral-900">
          채팅방
        </h1>
        <div className="flex flex-col">
          {chatRoomData?.chatRooms && chatRoomData.chatRooms.length > 0 ? (
            chatRoomData.chatRooms.map((chatRoom, index) => (
              <ChatRoomSearchItem key={index} chatRoom={chatRoom} />
            ))
          ) : (
            <p className="px-3 text-neutral-500">
              "{query}"로 검색한 채팅방이 없습니다
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-4 px-3 text-2xl font-bold text-neutral-900">
          사용자
        </h1>
        <div className="flex flex-col">
          {userData?.users && userData.users.length > 0 ? (
            userData.users.map((user) => (
              <div
                key={user.id}
                className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left hover:bg-neutral-100"
              >
                <div
                  className="flex items-center gap-3 hover:cursor-pointer"
                  onClick={() => {
                    navigate(`/user/${user.username}`);
                  }}
                >
                  <img
                    src={user.imageUrl}
                    className="size-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-medium">{user.username}</h2>
                  </div>
                </div>
                <DropdownButton
                  items={[
                    {
                      label: "채팅방에 초대",
                      action: () => {},
                      Icon: UserPlus,
                    },
                  ]}
                >
                  <Button
                    variant={"transparent"}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <EllipsisVertical />
                  </Button>
                </DropdownButton>
              </div>
            ))
          ) : (
            <p className="px-3 text-neutral-500">
              "{query}"로 검색한 사용자가 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
