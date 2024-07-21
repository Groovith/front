import spotifyLogo from "../assets/Spotify_Primary_Logo_RGB_Green.png";
import appleMusicLogo from "../assets/Apple_Music_Icon_RGB_lg_073120.svg";
import { Button } from "../components/Button";

export default function Setting() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full max-w-[720px] flex-col gap-10 py-20 px-10">
        <h1 className="text-4xl font-bold">설정</h1>
        {/* 스트리밍 서비스 */}
        <div>
          <h2 className="mb-3 text-xl font-bold">스트리밍 서비스</h2>
          <p className="mb-8">
            음악 컨텐츠 스트리밍에 사용할 서비스를 선택하고 계정을 연결하세요.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-4">
                <img src={spotifyLogo} alt="Spotify" className="w-8" />
                <p className="font-bold">Spotify</p>
              </div>
              <Button>연결</Button>
            </div>
            <div className="flex w-full justify-between rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-4">
                <img src={appleMusicLogo} alt="Spotify" className="w-8" />
                <p className="font-bold">Apple Music</p>
              </div>
              <Button>연결</Button>
            </div>
          </div>
        </div>
        {/* 계정 관련 */}
        <div>
          <h2 className="mb-3 text-xl font-bold">계정</h2>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">개인정보 보호</h2>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">언어</h2>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">도움말 및 정보</h2>
        </div>
      </div>
    </div>
  );
}
