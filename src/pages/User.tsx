import { Button } from "../components/Button";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsByUsername } from "../utils/apis/serverAPI";
import { UserDetailsType } from "../types/types";
import { useUser } from "../hooks/useUser";
import Loading from "./Loading";
import { useState } from "react";
import ProfileModal from "../components/user/ProfileModal";
import UsernameModal from "../components/user/UsernameModal";
import { UserPlus } from "lucide-react";

export default function User() {
  const { getUserId } = useUser();
  const { username } = useParams();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

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

  if (isUserDetailsLoading) {
    return <Loading />;
  }

  // 유저네임이 현재 로그인한 유저네임과 같은지 확인 -> 내 프로필 화면 | 타 유저 프로필 화면 결정

  return (
    <div className="flex h-full w-full justify-center px-10 text-neutral-900">
      <div className="flex w-full max-w-screen-md flex-col gap-10 py-20">
        <div className="flex items-center gap-8">
          <img
            src={userDetails?.imageUrl}
            className="size-28 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-neutral-900">
                {userDetails?.username}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-5">
          {userDetails && userDetails.id === getUserId() ? (
            <div className="flex flex-col w-full h-fit gap-10">
              <div className="flex w-full">
                <Button
                  className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200"
                  onClick={() => setProfileModalOpen(true)}
                >
                  프로필 수정
                </Button>
              </div>
              <div className="flex w-full justify-between items-center">
                <h1 className="text-xl font-bold">친구 목록</h1>
                <Button variant={"ghost"}>
                  <UserPlus />
                </Button>
              </div>
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
          ) : (
            <>
              <Button className="w-full">친구 추가</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
