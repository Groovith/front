import { Outlet, useNavigate } from "react-router-dom";
import Player from "../layouts/Player";
import Sidebar from "../layouts/Sidebar";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import useApi from "../hooks/useApi";

export default function Main() {
  const { validate } = useApi();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * 메인 화면 접속 시.
   * Access 토큰이 LocalStorage에 있는 지 확인. -> 없으면 로그인으로 리디렉션.
   * 토큰 유효성 검사 요청. -> 오류 발생 시 로그인으로 리디렉션.
   */
  useEffect(() => {
    setIsLoading(true); // 로딩 화면 렌더링 판별용

    const accessToken = localStorage.getItem("accessToken");

    // Access Token 이 없는 경우 리디렉션
    if (!accessToken) {
      //navigate("/login");
    }

    validate();
  }, []);

  // 로딩 중일 경우 로딩 페이지 반환
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="flex h-full">
        <Sidebar />
        <Outlet />
      </div>
      <Player />
    </div>
  );
}
