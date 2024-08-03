import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "../components/Button";
import { useEffect, useRef } from "react";
import { formatDuation } from "../utils/formatDuration";
import { usePlayer } from "../hooks/usePlayer";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import { getSpotifyToken } from "../utils/apis/serverAPI";

export default function Player() {
  const { initializePlayer, togglePlay, seek } = usePlayer();
  const { player, currentTrack, paused, position, setPosition, duration } =
    usePlayerStore();
  const navigate = useNavigate();
  const { streaming } = useUserStore();
  const timerRef = useRef<number | null>(null);
  const { isCurrentChatRoomOpen, toggleCurrentChatRoomOpen } =
    useChatRoomStore();

  // 스트리밍 서비스 확인 -> 새 토큰 불러오기 -> 플레이어 연결
  useEffect(() => {
    const initializeSpotifyPlayer = async () => {
      try {
        const data = await getSpotifyToken();
        localStorage.setItem("spotifyAccessToken", data.spotifyAccessToken);
        initializePlayer();
      } catch (e) {
        console.error("스포티파이 토큰 받기 에러", e);
      }
    };

    if (streaming === "SPOTIFY") {
      initializeSpotifyPlayer();
    }
  }, [streaming]);

  // 트랙 현재 시간 표시
  useEffect(() => {
    if (!player) return;
    if (!paused) {
      timerRef.current = setInterval(() => {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setPosition(state.position);
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused, player, setPosition]);

  // 트랙 위치 변경
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="flex h-[80px] w-full justify-between border-t">
      {streaming === "NONE" && (
        <div className="flex h-full w-full items-center justify-center">
          <a
            className="text-sm text-neutral-400 hover:cursor-pointer hover:underline"
            onClick={() => {
              navigate("/setting");
            }}
          >
            음악을 듣기 위해 스트리밍 서비스를 연결해주세요.
          </a>
        </div>
      )}
      {streaming === "SPOTIFY" && (
        <>
          {currentTrack ? (
            <input
              className="absolute z-10 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
              type="range"
              min="0"
              max={duration}
              value={position}
              onChange={handleSeek}
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
          <div className="ml-6 flex items-center gap-1">
            <Button variant={"transparent"} className="text-neutral-600">
              <SkipBack />
            </Button>
            {paused ? (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={togglePlay}
              >
                <Play />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={togglePlay}
              >
                <Pause />
              </Button>
            )}
            <Button variant={"transparent"} className="text-neutral-600">
              <SkipForward />
            </Button>
            <div className="ml-2 flex items-center gap-1 text-sm text-neutral-400">
              <p>{formatDuation(position)}</p>
              <p>/</p>
              <p>{formatDuation(duration)}</p>
            </div>
          </div>
          <div className="flex items-center">
            {currentTrack && currentTrack.album.release_date ? (
              <div className="flex items-center">
                <img
                  src={currentTrack.album.images[0].url}
                  className="mr-3 size-12 rounded-sm"
                />
                <div className="flex flex-col">
                  <p className="text-neutral-900">
                    {currentTrack.name}
                  </p>
                  <p className="text-neutral-500">
                    {currentTrack.artists[0].name} • {currentTrack.album.name} •{" "}
                    {currentTrack.album.release_date.split("-")[0]}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                재생 중인 곡이 없습니다
              </p>
            )}
          </div>
          <div className="mr-6 flex items-center">
            {isCurrentChatRoomOpen ? (
              <Button
                variant={"transparent"}
                onClick={toggleCurrentChatRoomOpen}
              >
                <ChevronDown />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                onClick={toggleCurrentChatRoomOpen}
              >
                <ChevronUp />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
