import { Outlet, useNavigate } from "react-router-dom";
import Player from "../layouts/Player";
import Sidebar from "../layouts/Sidebar";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { api } from "../utils/axiosUtil";
import axios from "axios";

export default function Main() {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // 메인 화면 접속 시 토큰 재발급 요청 -> 오류 발생 시 로그인으로 리디렉션
  useEffect(() => {
    setIsLoading(true); // 로딩 화면 렌더링 판별용

    const reissueToken = async () => {
      try {
        const response = await api.post("/reissue");
        localStorage.setItem("accessToken", response.headers.access);
      } catch (error) {
        // 추후 401 Unauthorized 등 에러 종류에 따라 구별 필요
        if (axios.isAxiosError(error)) {
          if(error.response?.status === 401) {
            navigate("/login");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    // reissueToken();
    setIsLoading(false); // 테스트용 토큰 재발급 요청 생략 -> 후에 삭제
  }, []);

  // 로딩 중일 경우 로딩 페이지 반환
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex h-full">
        <Sidebar />
        <Outlet />
      </div>
      <Player />
    </div>
  );
}
