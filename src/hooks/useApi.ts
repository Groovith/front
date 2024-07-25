import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * API 요청에 관련 훅
 */

const baseURL: string = "http://localhost:8080/api";

/**
 * axios 인스턴스 생성
 */
export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

/**
 * 요청 인터셉터. Local Storage 에서 Access 토큰 헤더에 추가.
 *
 * 참고: https://axios-http.com/kr/docs/interceptors
 */
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
 * 토큰 재발급 요청 함수
 *
 * return 새로 발급 받은 Access 토큰
 */
const reissueTokens = async (): Promise<string> => {
  try {
    const response = await api.post("/reissue");
    const accessToken = response.headers.access;
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (e) {
    throw new Error("Failed to reissue tokens.");
  }
};

/**
 * 응답 인터셉터. 401(Unauthorized) 응답에 대해 토큰 재발급 요청
 */
api.interceptors.response.use(
  function (config) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    return config;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러 처리 -> 토큰 재발급
      try {
        console.log("토큰 재요청");
        error.config.headers.access = reissueTokens();
        return api(error.config);
      } catch (e) {
        console.log("토큰 재요청 실패");
        console.error("Error reissuing tokens: ", e);
      }
    }

    return Promise.reject(error);
  },
);

export default function useApi() {
  const navigate = useNavigate();

  const validate = async (): Promise<void> => {
    await api.get("/validate").catch((e) => {
      console.log("토큰 유효성 검사 실패: ", e);
      navigate("/login");
    });
  };

  return { validate };
}
