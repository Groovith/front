import { useUserStore } from "../stores/useUserStore";
import { UserDetailsType } from "../types/types";

/**
 * 현재 로그인된 유저 관련 정보와 상호작용하는 커스텀 훅
 */
export function useUser() {
  const { userId, username, setUserId, setUsername } =
    useUserStore();

  // 유저 디테일 저장
  const updateUserDetails = (user: UserDetailsType) => {
    setUserId(user.id);
    setUsername(user.username);
  };

  // 유저 아이디 반환. 현재 null인 경우 서버에 요청하여 업데이트 후 반환
  const getUserId = (): number => {
    if (!userId) throw new Error("userId is null");
    return userId;
  };

  // 유저이름 반환. 현재 null인 경우 서버에 요청하여 업데이트 후 반환
  const getUsername = (): string => {
    if (!username) throw new Error("username is null");
    return username;
  };

  return { updateUserDetails, getUserId, getUsername };
}
