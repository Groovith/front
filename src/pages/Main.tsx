import { Outlet, useNavigate } from "react-router-dom";
import Player from "../layouts/Player";
import Sidebar from "../layouts/Sidebar";
import Loading from "./Loading";
import { useQuery } from "@tanstack/react-query";
import { brokerURL, getUserDetails } from "../utils/apis/serverAPI";
import { useUser } from "../hooks/useUser";
import { UserDetailsType } from "../types/types";
import { Client } from "@stomp/stompjs";
import { useStompStore } from "../stores/useStompStore";
import CurrentChatRoom from "../layouts/CurrentChatRoom";
import BottomNavigation from "../layouts/BottomNavigation";

export default function Main() {
  const navigate = useNavigate();
  const { updateUserDetails } = useUser();
  const { stompClient, setStompClient } = useStompStore();
  // const { setChatRoomList, setNewMessage } = useChatRoomStore();

  /**
   * 메인 화면 접속 시.
   * 토큰 유효성 검사 겸 유저 정보 요청. -> 오류 발생 시 로그인으로 리디렉션.
   */
  const { isLoading, isError, isSuccess } = useQuery<UserDetailsType>({
    queryKey: ["user"],
    queryFn: () =>
      getUserDetails().then((data) => {
        updateUserDetails(data);
        return data;
      }),
    retry: false,
  });

  // 로딩 중일 경우 로딩 페이지 반환
  if (isLoading) {
    return <Loading />;
  }

  // 에러 발생 시 로그인 페이지로 이동
  if (isError) {
    navigate("/login");
  }

  /**
   * 유저 데이터 불러오기 성공 시 -> 웹소켓 연결 -> 채팅방 구독
   * STOMP 클라이언트는 zustand store로 전역 관리
   */
  if (isSuccess && !stompClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    // STOMP 커스텀 헤더
    const headers = { Authorization: `Bearer ${accessToken}` };

    // STOMP 클라이언트 설정
    const client = new Client({
      brokerURL: brokerURL,
      connectHeaders: headers,
      onConnect: () => {
        // 연결 성공 시
        console.log("STOMP 연결 성공: ", client);

        // zustand Store에 보관
        setStompClient(client);
      },
      onStompError: (e) => {
        console.error("STOMP 연결 실패: ", e);
        client.deactivate();
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // STOMP 클라이언트 연결
    client.activate();
  }

  return (
    <div className="flex w-full full-vh flex-col break-keep text-neutral-900">
      <div className="flex h-full overflow-hidden">
        <Sidebar />
        <div className="relative flex h-full w-full">
          <CurrentChatRoom />
          <Outlet />
        </div>
      </div>
      <Player />
      <BottomNavigation />
    </div>
  );
}
