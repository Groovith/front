import axios from "axios";

/**
 * Axios 설정
 */

const serverURL: string = "http://localhost:8080/api";

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: serverURL,
  withCredentials: true,
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

// 응답 인터셉터
api.interceptors.response.use(
  async function (response) {
    // 2xx 범위에 있는 상태 코드인 경우
    return response;
  },
  async function (error) {
    // 2xx 외의 범위에 있는 상태 코드인 경우
    // 응답 오류가 있는 작업 수행
    const {
      config,
      response: { status },
    } = error;
    if (status === 401) {
      // 토큰 재발급이 필요한 경우
      try {
        const response = await api.post("/reissue");
        if (response.status === 200) {
          const accessToken = response.headers.access;
          localStorage.setItem("accessToken", accessToken);
          // 토큰 갱신 성공. API 재요청
          return api(config);
        } else {
          // 토큰 갱신 실패
        }
      } catch (e) {
        // 토큰 재발급 실패: 에러
      }
    }

    return Promise.reject(error);
  },
);

/**
 * API 목록
 */

type Validate = () => void;
type Login = (username: string, password: string) => void;

export const validate: Validate = async () => {};
export const login: Login = async (username, password) => {};
