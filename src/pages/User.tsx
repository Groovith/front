import { Button } from "../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsByUsername } from "../utils/apis/serverAPI";
import { UserDetailsType } from "../types/types";
import Loading from "./Loading";
import { useState } from "react";
import ProfileModal from "../components/user/ProfileModal";
import UsernameModal from "../components/user/UsernameModal";
import FriendsList from "../components/user/FriendsList";
import NotFound from "./errors/NotFound";
import { ChevronLeft } from "lucide-react";
import { deleteFriend } from "../utils/apis/friends/deleteFriend.api";
import { toast } from "sonner";
import { addFriend } from "../utils/apis/friends/addFriend.api";

export default function User() {
  const { username } = useParams();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const navigate = useNavigate();

  // username으로 프로필 검색 -> 없으면 없는 유저 화면
  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    refetch,
  } = useQuery<UserDetailsType>({
    queryKey: ["userDetails", username],
    queryFn: () => getUserDetailsByUsername(username as string),
    enabled: !!username,
  });

  // 친구 추가
  const handleAddFriend = async () => {
    if (!userDetails) return;
    try {
      await addFriend(userDetails.username);
      refetch();
      toast.success("사용자를 친구로 추가하였습니다.")
    } catch (e) {
      toast.error("친구 추가 중 문제가 발생하였습니다.");
      console.error("친구 추가 요청 실패: ", e);
    }
  };

  // 친구 삭제
  const handleDeleteFriend = async () => {
    if (!userDetails) return;
    try {
      await deleteFriend(userDetails.username);
      refetch();
      toast.success("사용자를 친구 목록에서 삭제하였습니다.")
    } catch (e) {
        toast.error("친구 삭제 중 문제가 발생하였습니다.");
        console.error(e);
    }
  };

  if (isUserDetailsLoading) {
    return <Loading />;
  }

  if (!userDetails) {
    return(<NotFound />)
  }

  // 유저네임이 현재 로그인한 유저네임과 같은지 확인 -> 내 프로필 화면 | 타 유저 프로필 화면 결정

  return (
    <div className="flex flex-col h-full w-full justify-between items-center text-neutral-900 overflow-y-auto">
      <div className="w-full pt-2 px-2 md:hidden" onClick={() => navigate(-1)}><Button variant={"ghost"}><ChevronLeft /></Button></div>
      <div className="flex w-full h-full max-w-screen-md flex-col gap-10 px-10 py-10">
        <div className="flex items-center gap-8">
          <img
            src={userDetails?.imageUrl}
            className="size-28 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">
                {userDetails?.username}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-5 pb-10">
          {userDetails.userRelationship === "SELF" && (
            <div className="flex flex-col w-full h-fit gap-10">
              <div className="flex w-full">
                <Button
                  className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200"
                  onClick={() => setProfileModalOpen(true)}
                >
                  프로필 수정
                </Button>
              </div>
              <FriendsList />
              {profileModalOpen && (
                <ProfileModal
                  userDetails={userDetails}
                  refetch={refetch}
                  onClose={() => setProfileModalOpen(false)}
                  onUsernameChangeClick={() => {
                    setProfileModalOpen(false);
                    setUsernameModalOpen(true);
                  }}
                />
              )}
              {usernameModalOpen && (
                <UsernameModal
                  onClose={() => {
                    setUsernameModalOpen(false);
                    setProfileModalOpen(true);
                  }}
                  username={username}
                />
              )}
            </div>
          )}
          {userDetails.userRelationship === "FRIEND" && (
            <Button variant={"white"} className="w-full" onClick={handleDeleteFriend}>친구 삭제</Button>
          )}
          {userDetails.userRelationship === "NOT_FRIEND" && (
            <Button className="w-full" onClick={handleAddFriend}>친구 추가</Button>
          )}
        </div>
      </div>
    </div>
  );
}
