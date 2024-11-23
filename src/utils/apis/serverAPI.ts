import axios, { AxiosResponse } from "axios";
import {
  ChatRoomDetailsType,
  MessageType,
  PlayerDetailsDto,
  PlayerRequestDto,
  SpotifyTrack,
  UserDetailsType,
} from "../../types/types";
import ResponseDto from "./response.dto";
import { Track } from "../../types/track.type";

/**
 * Axios 설정
 */

const serverURL: string = "http://localhost:8080/api";

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: serverURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
// 참고: https://jihyundev.tistory.com/34
api.interceptors.request.use(
  function (config) {
    // 로컬 스토리지에서 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // 토큰 있으면 요청 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터. 401(Unauthorized) 응답에 대해 토큰 재발급 요청
 */
api.interceptors.response.use(
  function (config) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    return config;
  },
  async function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러 처리 -> 토큰 재발급
      try {
        const response = await axios.post("/reissue");

        const newAccessToken = response.headers["authorization"].replace(
          "Bearer ",
          "",
        );
        localStorage.setItem("accessToken", newAccessToken);

        error.config.headers.access = newAccessToken;
        return api(error.config); // 기존 요청 재시도
      } catch (e) {
        console.error("토큰 재요청 실패", e);
        localStorage.removeItem("accessToken"); // Access 토큰 삭제
        window.location.replace("/login"); // 로그인 페이지로 리디렉션
      }
    }

    return Promise.reject(error);
  },
);

/**
 * API 목록
 */

// 토큰 유효성 검사
export const validateToken = async () => {
  const response = await api.get("/validate");
  return response;
};

interface SignupRequest {
  username: string;
  password: string;
  email: string;
}

// 이메일 중복 체크
export const checkEmail = async (request: { email: string }) => {
  const response = await axios.post<ResponseDto>(
    serverURL + "/auth/check-email",
    request,
  );
  return response.data;
};

// 이메일 인증번호 요청
export const requestEmailCertification = async (request: { email: string }) => {
  const response = await axios.post<ResponseDto>(
    serverURL + "/auth/email-certification",
    request,
  );
  return response.data;
};

// 이메일 인증번호 확인
export const checkEmailCertification = async (request: {
  email: string;
  certificationNumber: string;
}) => {
  const response = await axios.post<ResponseDto>(
    serverURL + "/auth/check-certification",
    request,
  );
  return response.data;
};

// 유저네임 중복 확인
export const checkUsername = async (request: { username: string }) => {
  const response = await axios.post<ResponseDto>(
    serverURL + "/auth/check-username",
    request,
  );
  return response.data;
};

// 회원가입
export const signup = async (request: SignupRequest) => {
  const response = await axios.post(serverURL + "/join", request);
  return response.data;
};

// 로그인
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(serverURL + "/login", credentials, {
    withCredentials: true,
  });
  return response;
};

// 비밀번호 재설정 이메일 요청
export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(
    serverURL + "/auth/request-password-reset",
    { email: email },
  );
  return response;
};

// 비밀번호 재설정 요청
export const resetPassword = async (
  email: string,
  code: string,
  password: string,
) => {
  const response = await axios.patch(serverURL + "/auth/reset-password", {
    email: email,
    code: code,
    password: password,
  });
  return response;
};

// 로그아웃
export const logout = async () => {
  await axios.get("/logout");
};

// 현재 유저 정보 요청
export const getUserDetails = async () => {
  const response = await api.get<UserDetailsType>("/users/me");
  return response.data;
};

// 유저네임으로 유저 정보 요청
export const getUserDetailsByUsername = async (username: string) => {
  const response = await api.get<UserDetailsType>(`/users/${username}`);
  return response.data;
};

// 유저 프로필 사진 변경
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.put("/upload/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// 유저 프로필 사진 삭제
export const deleteProfileImage = async () => {
  const response = await api.delete("/users/me/update/profile-picture");
  return response.data;
};

interface SearchUsersResponse {
  users: UserDetailsType[];
}

// 유저 검색
export const searchUsers = async (query: string) => {
  const response = await api.get<SearchUsersResponse>(
    `/search/users?query=${query}`,
  );
  return response.data;
};

interface SearchChatRoomsResponse {
  chatRooms: ChatRoomDetailsType[];
}

// 채팅방 검색
export const searchChatRooms = async (query: string) => {
  const response = await api.get<SearchChatRoomsResponse>(
    `/search/chatrooms?query=${query}`,
  );
  return response.data;
};

/**
 * 채팅 관련 API
 */

// 내 채팅방 목록 요청
export const fetchChatRooms = async () => {
  const response = await api.get<{ chatRooms: ChatRoomDetailsType[] }>(
    "/chatrooms/me",
  );
  return response.data;
};

export interface CreateChatRoomRequest {
  name: string;
  privacy: ChatRoomPrivacyType;
  permission: ChatRoomPlayerPermissionType;
}

// 채팅방 사용자 목록 조회
export const getChatRoomMembers = async (chatRoomId: string | number) => {
  if (chatRoomId === undefined) return [];
  const response = await api.get<{ data: UserDetailsType[] }>(
    `/chatrooms/${chatRoomId}/members`,
  );
  return response.data.data;
};

export type ChatRoomPrivacyType = "PUBLIC" | "PRIVATE";
export type ChatRoomPlayerPermissionType = "MASTER" | "EVERYONE";

// 채팅방 생성
export const createChatRoom = async (
  dto: CreateChatRoomRequest,
  file: File | null,
) => {
  const formData = new FormData();
  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );
  if (file) formData.append("file", file);

  const response = await api.post<{ chatRoomId: number }>(
    "/chatrooms",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// 채팅방 참가
export const joinChatRoom = async (chatRoomId: number) => {
  const response = await api.put(`/chatrooms/${chatRoomId}/enter`);
  return response.data;
};

// 채팅방 나가기
export const leaveChatRoom = async (chatRoomId: number) => {
  const response = await api.put(`/chatrooms/${chatRoomId}/leave`);
  return response.data;
};

// 채팅방 아이디로 채팅방 상세 정보 조회
export const getChatRoomDetails = async (
  chatRoomId: number | undefined | null,
) => {
  if (!chatRoomId) return undefined;
  const response = await api.get<ChatRoomDetailsType>(
    `/chatrooms/${chatRoomId}`,
  );
  return response.data;
};

// 채팅방 메시지 불러오기
export const getChatRoomMessages = async (
  chatRoomId: number,
  lastMessageId?: number | null,
) => {
  const response = await api.get<{ messages: MessageType[] }>(
    `/chat/${chatRoomId}`,
    {
      params: {
        lastMessageId: lastMessageId,
      },
    },
  );
  return response.data.messages;
};

// ------------------ 같이 듣기 ----------------------

// 채팅방 플레이어 정보 불러오기
export const getPlayer = async (chatRoomId: number) => {
  const response = await api.get<PlayerDetailsDto>(
    `/chatrooms/${chatRoomId}/player`,
  );
  return response.data;
};

// 같이 듣기 참가
export const joinPlayer = async (chatRoomId: number) => {
  const response = await api.patch<PlayerDetailsDto>(
    `/chatrooms/${chatRoomId}/player/join`,
  );
  return response.data;
};

// 같이 듣기 나가기
export const leavePlayer = async (chatRoomId: number) => {
  const response = await api.patch(`/chatrooms/${chatRoomId}/player/leave`);
  return response.data;
};

// 토글 재생
export const requestTogglePlay = async (
  chatRoomId: string | number,
  playerRequestDto: PlayerRequestDto,
) => {
  const response: AxiosResponse<void> = await api.patch(
    `/chatrooms/${chatRoomId}/player/toggle`,
    playerRequestDto,
  );
  return response.data;
};

// 재생 위치 이동
export const requestSeek = async (
  chatRoomId: string | number,
  position: number,
) => {
  const response: AxiosResponse<void> = await api.patch(
    `/chatrooms/${chatRoomId}/player/seek?position=${position}`,
  );
  return response.data;
};

// 새 트랙 재생
export const requestPlayNewTrack = async (
  chatRoomId: string | number,
  playerRequestDto: PlayerRequestDto,
) => {
  const response: AxiosResponse<void> = await api.post(
    `/chatrooms/${chatRoomId}/player/track`,
    playerRequestDto,
  );
  return response.data;
};

// 특정 인덱스의 트랙 재생
export const requestPlayAtIndex = async (
  chatRoomId: string | number,
  index: number,
) => {
  const response: AxiosResponse<void> = await api.patch(
    `/chatrooms/${chatRoomId}/player/track/${index}`,
  );

  return response.data;
};

// 다음 곡 재생
export const requestNextTrack = async (chatRoomId: string | number) => {
  const response: AxiosResponse<void> = await api.patch(
    `/chatrooms/${chatRoomId}/player/track/next`,
  );

  return response.data;
};

// 이전 곡 재생
export const requestPreviousTrack = async (chatRoomId: string | number) => {
  const response: AxiosResponse<void> = await api.patch(
    `/chatrooms/${chatRoomId}/player/track/previous`,
  );

  return response.data;
};

// 현재 플레이리스트에 추가
export const requestAddToCurrentPlaylist = async (
  chatRoomId: string | number,
  track: SpotifyTrack,
) => {
  const response: AxiosResponse<void> = await api.post(
    `/chatrooms/${chatRoomId}/player/current-playlist`,
    { track: track },
  );
  return response.data;
};

// 현재 플레이리스트에서 삭제
export const requestRemoveFromCurrentPlaylist = async (
  chatRoomId: string | number,
  index: number,
) => {
  const response: AxiosResponse<void> = await api.delete(
    `/chatrooms/${chatRoomId}/player/current-playlist/${index}`,
  );
  return response.data;
};

// 음악 정보 불러오기
export const getTrackInfo = async (videoId: string) => {
  const response: AxiosResponse<Track> = await api.get<Track>("/video", {
    params: {
      videoId, // 쿼리 파라미터로 전달
    },
  });
  return response.data;
};
