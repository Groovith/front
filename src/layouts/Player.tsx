import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "../components/Button";
import { useEffect, useRef, useState } from "react";
import { formatDuation } from "../utils/formatDuration";
import { usePlayer } from "../hooks/usePlayer";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import {
  getSpotifyToken,
  requestNextTrack,
  requestPreviousTrack,
} from "../utils/apis/serverAPI";
import { playTrack } from "../utils/apis/spotifyAPI";

export default function Player() {
  const {
    initializePlayer,
    resumePlayer,
    pausePlayer,
    seek,
    previousTrack,
    nextTrack,
    playNewTrack,
    playAtIndex,
    addToCurrentPlaylist,
    removeFromCurrentPlaylist,
    trackEnded,
  } = usePlayer();
  const {
    player,
    deviceId,
    paused,
    position,
    duration,
    loading,
    playerResponseMessage,
    isListenTogetherConnected,
    setPosition,
    setPaused,
    setDuration,
    setLoading,
    currentPlaylist,
    currentPlaylistIndex,
    listenTogetherId,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
  } = usePlayerStore();
  const navigate = useNavigate();
  const { streaming } = useUserStore();
  const { isCurrentChatRoomOpen, toggleCurrentChatRoomOpen } =
    useChatRoomStore();
  const [newPosition, setNewPosition] = useState<number>();
  const timerRef = useRef<number>(0); // 플레이어 상태 불러오는 타이머

  // 유저 플레이백 큐 불러오기
  // const { data: userQueueData } = useQuery({
  //   queryKey: ["userQueue"],
  //   queryFn: getUserQueue,
  // });

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

  // 트랙 종료 판단 -> 다음 곡 재생 호출
  useEffect(() => {
    if (position === 0 && paused && !loading && currentPlaylist.length > 0) {
      console.log("nextTrack");

      if (isListenTogetherConnected && listenTogetherId) {
        trackEnded();
      } else {
        nextTrack();
      }
    }
  }, [position, paused, loading]);

  // 트랙 현재 시간 업데이트
  useEffect(() => {
    if (!player || !timerRef) return;
    if (!paused) {
      timerRef.current = setInterval(() => {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setPosition(state.position);
            setPaused(state.paused);
            setDuration(state.duration);
            setLoading(state.loading);
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
  }, [
    currentPlaylist,
    player,
    paused,
    timerRef,
    currentPlaylistIndex,
    position,
    duration,
  ]);

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    seek(newPosition);
  };

  // 새 플레이어 메시지 수신 시 현재 상태와 비교해서 업데이트
  useEffect(() => {
    if (!playerResponseMessage) return;

    console.log(playerResponseMessage);

    const { action, track, position, currentPlaylist, index } =
      playerResponseMessage;

    // action 이 정해져 있는 경우 그에 따라 플레이어 조작
    if (action) {
      switch (action) {
        case "PLAY_TRACK":
          if (track) {
            playTrack(track.uri, deviceId, position);
          }
          if (index) {
            setCurrentPlaylistIndex(index);
          }
          break;
        case "PAUSE":
          if (position === undefined || !player) return;
          player.seek(position).then(() => {
            player.pause();
          });
          break;
        case "RESUME":
          if (position === undefined || !player) return;
          player.seek(position).then(() => {
            player.resume();
          });
          break;
        case "SEEK":
          if (position === undefined || !player) return;
          player.seek(position);
          break;
        case "UPDATE":
          setCurrentPlaylist(currentPlaylist!);
          setCurrentPlaylistIndex(index!);
      }
    }
  }, [playerResponseMessage]);

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
          {currentPlaylist[currentPlaylistIndex] ? (
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
          <div className="ml-6 flex items-center gap-1">
            <Button
              variant={"transparent"}
              className="text-neutral-600"
              onClick={() => previousTrack()}
            >
              <SkipBack />
            </Button>
            {paused ? (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={() => resumePlayer()}
              >
                <Play />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={() => pausePlayer()}
              >
                <Pause />
              </Button>
            )}
            <Button
              variant={"transparent"}
              className="text-neutral-600"
              onClick={() => nextTrack()}
            >
              <SkipForward />
            </Button>
            <div className="ml-2 flex items-center gap-1 text-sm text-neutral-400">
              <p>{formatDuation(position)}</p>
              <p>/</p>
              <p>{formatDuation(duration)}</p>
            </div>
          </div>
          <div className="flex items-center">
            {currentPlaylist[currentPlaylistIndex] ? (
              <div className="flex items-center">
                <img
                  src={
                    currentPlaylist[currentPlaylistIndex].album.images[0].url
                  }
                  className="mr-3 size-12 rounded-sm"
                />
                <div className="flex flex-col">
                  <p className="text-neutral-900">
                    {currentPlaylist[currentPlaylistIndex].name}
                  </p>
                  <p className="text-neutral-500">
                    {currentPlaylist[currentPlaylistIndex].artists[0].name} •{" "}
                    {currentPlaylist[currentPlaylistIndex].album.name} •{" "}
                    {
                      currentPlaylist[
                        currentPlaylistIndex
                      ].album.release_date.split("-")[0]
                    }
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
