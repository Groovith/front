import axios, { AxiosHeaders } from "axios";
import { getSpotifyToken } from "./serverAPI";
import { SpotifySearchResponse } from "../types";

/**
 * Spotify API 통신용 Axios 인스턴스와 API 호출 함수들.
 */
const baseURL: string = "https://api.spotify.com/v1";

export const spotifyApi = axios.create({
  baseURL: baseURL,
});

// 요청 인터셉터
spotifyApi.interceptors.request.use(
  async function (config) {
    // 로컬 스토리지에서 토큰 가져오기
    const spotifyToken = localStorage.getItem("spotifyAccessToken");

    // 토큰 없으면 서버에 요청
    if (!spotifyToken) {
      try {
        const response = await getSpotifyToken();
        const newSpotifyToken = response.spotifyAccessToken;

        localStorage.setItem("spotifyAccessToken", newSpotifyToken);
      } catch (e) {
        console.log("스포티파이 토큰 요청 실패: ", e);
      }
    }

    // 토큰 있으면 요청 헤더에 추가
    if (spotifyToken) {
      config.headers["Authorization"] = `Bearer ${spotifyToken}`;
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
spotifyApi.interceptors.response.use(
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
        // 백엔드 서버에 토큰 재요청
        const response = await getSpotifyToken();
        const newSpotifyToken = response.spotifyAccessToken;
        localStorage.setItem("spotifyAccessToken", newSpotifyToken);

        error.config.headers.Authorization = `Bearer ${newSpotifyToken}`;
        return spotifyApi(error.config); // 기존 요청 재시도
      } catch (e) {
        console.error("스포티파이 토큰 재요청 실패", e);
        localStorage.removeItem("spotifyAccessToken"); // Access 토큰 삭제
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Spotify 검색
 *
 * type 패러미터를 이용해 검색 결과 변경 가능
 * 현재는 Track으로 한정
 */
export const spotifySearch = async (query: string) => {
  const response = await spotifyApi.get<SpotifySearchResponse>(
    `/search?q=${encodeURIComponent(query)}&type=track`,
  );
  return response.data;
};

// 트랙 재생 요청 API
export const playTrack = async (trackUri: string, deviceId: string) => {
  try {
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${
      deviceId
    }`;
    const body = {
      // context_uri: track.album.uri,
      // offset: { uri: track.uri },
      uris: [trackUri],
    };

    await spotifyApi.put(url, body);
  } catch (e) {
    console.error("트랙 재생 에러: ", e);
  }
};