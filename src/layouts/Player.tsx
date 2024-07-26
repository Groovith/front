import { ChevronUp, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { formatDuation } from "../utils/formatDuration";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  
  useEffect(() => {

  }, [])

  // 스트리밍 서비스 확인 ? 플레이어 연결 : 연결된 플레이어 없음
  

  // 플레이어 연결 : 토큰 요청 -> useSpotify 연결

  return (
    <div className="flex h-[80px] w-full justify-between">
      {/* Seek Bar */}
      <input
        className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-gray-200 accent-black outline-none disabled:accent-gray-200"
        type="range"
        min="0"
        max="100"
        value={0}
        onChange={() => {}}
      />
      <div className="ml-5 flex items-center gap-1">
        <Button variant={"ghost"}>
          <SkipBack />
        </Button>
        {playing ? (
          <Button variant={"ghost"}>
            <Pause />
          </Button>
        ) : (
          <Button variant={"ghost"}>
            <Play />
          </Button>
        )}
        <Button variant={"ghost"}>
          <SkipForward />
        </Button>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <p>{formatDuation(position)}</p>
          <p>/</p>
          <p>{formatDuation(duration)}</p>
        </div>
      </div>
      <div className="flex items-center">
        {currentTrack != null ? (
          <div></div>
        ) : (
          <p className="text-sm text-gray-500">현재 재생 중인 곡이 없습니다</p>
        )}
      </div>
      <div className="flex items-center mr-5">
        <Button variant={"ghost"}>
          <ChevronUp />
        </Button>
      </div>
    </div>
  );
}
