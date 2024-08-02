import { useUserStore } from "../stores/useUserStore";
import { StreamingType, UserDetailsType } from "../utils/types";

/**
 * 현재 로그인된 유저 관련 정보와 상호작용하는 커스텀 훅
 */
export function useUser() {
  const { userId, username, streaming, setUserId, setUsername, setStreaming } =
    useUserStore();

  // 유저 디테일 저장
  const updateUserDetails = (user: UserDetailsType) => {
    setUserId(user.id);
    setUsername(user.username);
    setStreaming(user.streaming);
  };

  // 스트리밍 서비스 변경
  const updateStreaming = (streaming: StreamingType) => {
    setStreaming(streaming);
  }

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

  const getStreaming = (): StreamingType => {
    return streaming;
  };

  return { updateUserDetails, updateStreaming, getUserId, getUsername, getStreaming };
}
