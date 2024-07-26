import { Outlet, useNavigate } from "react-router-dom";
import Player from "../layouts/Player";
import Sidebar from "../layouts/Sidebar";
import Loading from "./Loading";
import { useQuery } from "@tanstack/react-query";
import { validateToken } from "../utils/apis/serverAPI";

export default function Main() {
  const navigate = useNavigate();

  /**
   * 메인 화면 접속 시.
   * 토큰 유효성 검사 요청. -> 오류 발생 시 로그인으로 리디렉션.
   */
  // const { isLoading, isError } = useQuery({
  //   queryKey: ["validate"],
  //   queryFn: () => validateToken(),
  //   retry: false,
  // });

  // // 로딩 중일 경우 로딩 페이지 반환
  // if (isLoading) {
  //   return <Loading />;
  // }

  // // 에러 발생 시 로그인 페이지로 이동
  // if (isError) {
  //   navigate("/login");
  // }

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
