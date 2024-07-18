import { Outlet, useNavigate } from "react-router-dom";
import Player from "../layouts/Player";
import Sidebar from "../layouts/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function Main() {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // 메인 화면 접속 시 토큰 재발급 요청 -> 오류 발생 시 로그인으로 리디렉션
  useEffect(() => {
    setIsLoading(true); // 로딩 화면 렌더링 판별용

    const reissueToken = async () => {
      try {
        const url: string = "http://localhost:8080/reissue";
        const response = await axios.post(
          url,
          {},
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("access_token", response.headers.access);
      } catch (error) {
        // 추후 401 Unauthorized 등 에러 종류에 따라 구별 필요
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    reissueToken();
  }, []);

  // 로딩 중일 경우 로딩 페이지 반환
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <h1>메인</h1>
        <Sidebar />
        <Outlet />
      </div>
      <Player />
    </div>
  );
}
