import {
  Headphones,
  ListMusic,
  ListPlus,
  Menu,
  MessageCirclePlus,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import H1 from "../components/common/H1";
import H2 from "../components/common/H2";

export default function Home() {
  return (
    <div className="flex size-full items-center justify-center px-10 py-16 overflow-y-auto">
      <div className="flex size-full max-w-screen-md flex-col gap-10 break-keep mb-12 ">
        <H1 className="text-3xl">Groovith에 오신 걸 환영합니다!</H1>

        <div className="flex flex-col gap-6 text-neutral-700 leading-relaxed">
          <H2 className="text-xl">Groovith 사용법</H2>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">1. 채팅방 만들기</h3>
            <p>
              채팅
              {"("}
              <Send size={18} color="#949494" className="mx-1 inline-block" />
              {")"}
              으로 이동하여, 채팅방 생성 버튼
              {"("}
              <MessageCirclePlus
                size={18}
                color="#949494"
                className="mx-1 inline-block"
              />
              {")"}을 클릭해 새로운 채팅방을 만들 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">2. 친구 추가</h3>
            <p>
              검색
              {"("}
              <Search size={18} color="#949494" className="mx-1 inline-block" />
              {")"}
              에서 친구의 사용자 이름을 검색하거나, 마이 페이지
              {"("}
              <UserRound
                size={18}
                color="#949494"
                className="mx-1 inline-block"
              />
              {")"}
              에서 사용자 이름으로 친구를 직접 추가할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">3. 채팅방에 친구 초대</h3>
            <p>
              채팅방 상단 메뉴
              {"("}
              <Menu size={18} color="#949494" className="mx-1 inline-block" />
              {")"}를 눌러 친구를 채팅방에 초대할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">4. 음악 같이 듣기</h3>
            <p>
              채팅방 상단 같이 듣기
              {"("}
              <Headphones
                size={18}
                color="#949494"
                className="mx-1 inline-block"
              />
              {")"}
              를 눌러 채팅방 같이 듣기에 참가할 수 있습니다. 이제 재생목록
              {"("}
              <ListMusic
                size={18}
                color="#949494"
                className="mx-1 inline-block"
              />
              {")"}
              에서 음악 추가
              {"("}
              <ListPlus
                size={18}
                color="#949494"
                className="mx-1 inline-block"
              />
              {")"}를 누르고 YouTube 링크를 넣어 원하는 음악을 추가하세요!
            </p>
          </div>
        </div>
        <p className="text-neutral-400">
          해당 홈 화면에는 인기 있는 채팅방, 최근 채팅방 등의 컨텐츠를 준비하고 있습니다...!
        </p>
      </div>
    </div>
  );
}
