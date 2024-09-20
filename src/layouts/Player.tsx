import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { formatDuation } from "../utils/formatDuration";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import YouTube, {
  YouTubeEvent,
  YouTubeProps,
} from "react-youtube";
import { MoonLoader } from "react-spinners";

export default function Player() {
  const [currentTrackId, setCurrentTrackId] = useState("");
  const [currentTrack, setCurrentTrack] = useState();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [newPosition, setNewPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  const { isCurrentChatRoomOpen, toggleCurrentChatRoomOpen } =
    useChatRoomStore();
  const playerRef = useRef<YouTubeEvent | null>(null);
  const timerRef = useRef<number>(0);

  // 유튜브 플레이어 설정
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      modestbranding: 1,
    },
  };

  // 플레이어 준비
  const onPlayerReady: YouTubeProps["onReady"] = (event: YouTubeEvent<any>) => {
    playerRef.current = event;
    console.log("Player Ready: ", playerRef.current);
    setDuration(playerRef.current!.target.getDuration());
  };

  // 플레이어 상태 변화 시 이벤트
  const onPlayerStateChange: YouTubeProps["onStateChange"] = (
    event: YouTubeEvent<any>,
  ) => {
    switch (event.data) {
      case YouTube.PlayerState.BUFFERING:
        console.log("Buffering...");
        setLoading(true);
        break;
      case YouTube.PlayerState.PLAYING:
        console.log("Playing...");
        setLoading(false);
        setPaused(false);
        break;
      case YouTube.PlayerState.PAUSED:
        console.log("Paused...");
        setLoading(false);
        setPaused(true);
        break;
      case YouTube.PlayerState.ENDED:
        console.log("Ended...");
        setLoading(false);
        setPaused(true);
        playerRef.current!.target.stopVideo();
        break;
    }
    setPosition(playerRef.current!.target.getCurrentTime());
    console.log(position);
  };

  // 재생
  const play = () => {
    if (!playerRef.current) return;
    playerRef.current.target.playVideo();
  };

  // 일시정지
  const pause = () => {
    if (!playerRef.current) return;
    playerRef.current.target.pauseVideo();
  };

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    playerRef.current!.target.seekTo(newPosition);
  };

  // 트랙 현재 시간 업데이트
  useEffect(() => {
    if (!paused && !loading) {
      timerRef.current = setInterval(() => {
        const newPosition = position + 1;
        setPosition(newPosition);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused, loading, position]);

  return (
    <div className="flex h-[80px] w-full justify-between border-t">
      <>
        {duration > 0 ? (
          <input
            className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
            type="range"
            min="0"
            max={duration}
            value={position}
            onChange={(e) => {
              e.preventDefault();
              setNewPosition(Number(e.target.value));
              setPosition(Number(e.target.value));
            }}
            onMouseUp={handleSeek}
            style={{
              background: `linear-gradient(to right, #FF6735 ${(position / duration) * 100}%, #E5E7EB ${(position / duration) * 100}%)`,
            }}
          />
        ) : (
          <input
            className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
            type="range"
            min="0"
            max="100"
            value={0}
            disabled
          />
        )}
        <div className="ml-6 flex items-center">
          <div className="flex items-center justify-between w-[140px]">
            <Button variant={"transparent"} className="text-neutral-600">
              <SkipBack />
            </Button>
            {loading ? (
              <MoonLoader size={20} />
            ) : paused ? (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={play}
                disabled={loading}
              >
                <Play />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={pause}
                disabled={loading}
              >
                <Pause />
              </Button>
            )}
            <Button variant={"transparent"} className="text-neutral-600">
              <SkipForward />
            </Button>
          </div>
          <div className="ml-2 flex items-center gap-1 text-sm text-neutral-400">
            <p>{formatDuation(position)}</p>
            <p>/</p>
            <p>{formatDuation(duration)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-neutral-400">재생 중인 곡이 없습니다</p>
        </div>
        <div className="mr-6 flex items-center">
          {isCurrentChatRoomOpen ? (
            <Button variant={"transparent"} onClick={toggleCurrentChatRoomOpen}>
              <ChevronDown />
            </Button>
          ) : (
            <Button variant={"transparent"} onClick={toggleCurrentChatRoomOpen}>
              <ChevronUp />
            </Button>
          )}
        </div>
      </>
      <YouTube
        videoId={"NM4e606yFJg"}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className={"absolute"}
      />
    </div>
  );
}
