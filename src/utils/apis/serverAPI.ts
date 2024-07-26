import axios, { AxiosResponse } from "axios";

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
      config.headers["access"] = accessToken;
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
        console.log("토큰 재요청");
        const response = await api.post("/reissue");

        const newAccessToken = response.headers.access;
        localStorage.setItem("accessToken", newAccessToken);

        error.config.headers.access = newAccessToken;
        return api(error.config); // 기존 요청 재시도
      } catch (e) {
        console.error("토큰 재요청 실패", e);
        localStorage.removeItem("accessToken"); // Access 토큰 삭제
        window.location.href = "/login"; // 로그인 페이지로 리디렉션
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

// 로그인
export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(
    "http://localhost:8080/api/login",
    credentials,
  );
  return response;
};

// 로그아웃
export const logout = async () => {
  await axios.get("/logout");
};

// 스트리밍 서비스 조회
export const getStreaming = async () => {
  const response = await api.get("/streaming");
  return response;
};

// 검색
export const search = async (query: string) => {
  const response = await api.get(`/streaming/search?query=${query}`);
  return response.data;
};

interface ConnectSporifyResponse {
  message: string,
  spotifyAccessToken: string,
  spotifyRefreshToken: string,
}

// Spotify 연결
export const connectSpotify = async (code: string) => {
  const response = await api.post<ConnectSporifyResponse>("/streaming/spotify", { code: code });
  return response.data;
};

// Spotify 토큰 재발급
export const getSpotifyToken = async () => {} 