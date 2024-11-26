import { useEffect, useRef, useState } from "react";
import { Button } from "../components/common/Button";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { formatDuration } from "../utils/formatDuration";
import { useChatRoomStore } from "../stores/useChatRoomStore";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { MoonLoader } from "react-spinners";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePlayer } from "../hooks/usePlayer";
import CurrentTrackInfo from "../components/player/CurrentTrackInfo";
import { formatDurationSec } from "../utils/formatDurationSec";

export default function Player() {
  const {
    currentPlaylist,
    currentPlaylistIndex,
    player,
    duration,
    position,
    loading,
    paused,
    playerResponseMessage,
    playerDetails,
    setPaused,
    setPlayer,
    setDuration,
    setPosition,
    setLoading,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    setPlayerDetails,
  } = usePlayerStore();
  const {
    resumePlayer,
    pausePlayer,
    seek,
    nextTrack,
    previousTrack,
    trackEnded,
  } = usePlayer();
  const [newPosition, setNewPosition] = useState(0);
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
    setPlayer(playerRef);
    setDuration(player?.current!.target.getDuration());
  };

  useEffect(() => {
    if (player?.current && playerDetails) {
      setTimeout(() => {
        player.current?.target.seekTo(playerDetails.position);
      }, 1000);

      if (playerDetails.paused) {
        setTimeout(() => {
          player.current?.target.pauseVideo();
        }, 1000);
      }

      setPlayerDetails(null);
    }
  }, [player, playerDetails]);

  // 플레이어 상태 변화 시 이벤트
  const onPlayerStateChange: YouTubeProps["onStateChange"] = (
    event: YouTubeEvent<any>,
  ) => {
    switch (event.data) {
      case YouTube.PlayerState.UNSTARTED:
        setLoading(false);
        break;
      case YouTube.PlayerState.BUFFERING:
        setLoading(true);
        break;
      case YouTube.PlayerState.PLAYING:
        setLoading(false);
        setPaused(false);
        break;
      case YouTube.PlayerState.PAUSED:
        setLoading(false);
        setPaused(true);
        break;
      case YouTube.PlayerState.ENDED:
        setLoading(false);
        trackEnded();
        break;
      case YouTube.PlayerState.CUED:
        setLoading(false);
        setPaused(true);
        break;
    }
    setDuration(player!.current!.target.getDuration());
    setPosition(player!.current!.target.getCurrentTime());
  };

  // 새 플레이어 메시지 수신 시 업데이트
  useEffect(() => {
    if (!playerResponseMessage) return;

    console.log(playerResponseMessage);

    const {
      action,
      position,
      currentPlaylist: newCurrentPlaylist,
      index,
      videoId,
    } = playerResponseMessage;

    if (action) {
      switch (action) {
        case "PLAY_TRACK":
          if (
            typeof index === "undefined" ||
            !player?.current ||
            typeof videoId === "undefined"
          )
            return;
          player.current.target.loadVideoById({ videoId: videoId });
          setCurrentPlaylistIndex(index);
          break;
        case "PAUSE":
          if (!player?.current) return;
          //player.current.target.seekTo(position);
          player.current.target.pauseVideo();
          break;
        case "RESUME":
          if (!player?.current) return;
          //player.current.target.seekTo(position);
          player.current.target.playVideo();
          break;
        case "SEEK":
          if (typeof position === "undefined" || !player?.current) return;
          player.current.target.seekTo(position);
          break;
        case "UPDATE":
          if (!newCurrentPlaylist || typeof index === "undefined") break;
          setCurrentPlaylist(newCurrentPlaylist);
          setCurrentPlaylistIndex(index);

          // 플레이리스트가 비어있던 경우 자동 재생
          if (
            player?.current?.target.getPlayerState() ===
            YouTube.PlayerState.UNSTARTED
          ) {
            player.current.target.loadVideoById({
              videoId: newCurrentPlaylist[index].videoId,
              startSeconds: 0,
            });
          }
          break;
      }
    }
  }, [playerResponseMessage]);

  // 트랙 위치 변경
  const handleSeek = () => {
    if (!newPosition) return;
    seek(newPosition);
  };

  // 트랙 현재 시간 업데이트
  useEffect(() => {
    if (!paused && !loading && position) {
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

  const handleButtonClick = (e: React.MouseEvent, func: () => void) => {
    e.stopPropagation();
    func();
  };

  return (
    <div className="flex h-[80px] w-full">
      {currentPlaylist[currentPlaylistIndex] ? (
        <input
          className="absolute z-40 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-[#FF6735] outline-none disabled:accent-gray-200"
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
          onTouchEnd={handleSeek}
          style={{
            background: `linear-gradient(to right, #FF6735 ${(position / duration) * 100}%, #E5E7EB ${(position / duration) * 100}%)`,
          }}
        />
      ) : (
        <input
          className="absolute z-40 h-1 w-full cursor-pointer appearance-none bg-neutral-200 accent-neutral-500 outline-none disabled:accent-gray-200"
          type="range"
          min="0"
          max="100"
          value={0}
          disabled
        />
      )}
      <div
        className="flex w-full justify-between truncate border-t"
        onClick={toggleCurrentChatRoomOpen}
      >
        <div className="ml-6 flex items-center">
          <div className="flex w-fit items-center justify-start gap-0">
            <Button
              variant={"transparent"}
              className="hidden text-neutral-600 md:flex"
              onClick={(e) => handleButtonClick(e, previousTrack)}
            >
              <SkipBack />
            </Button>
            {loading ? (
              <Button variant={"transparent"} className="flex">
                <MoonLoader size={18} />
              </Button>
            ) : paused ? (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={(e) => handleButtonClick(e, resumePlayer)}
                disabled={loading}
              >
                <Play />
              </Button>
            ) : (
              <Button
                variant={"transparent"}
                className="text-neutral-600"
                onClick={(e) => handleButtonClick(e, pausePlayer)}
                disabled={loading}
              >
                <Pause />
              </Button>
            )}
            <Button
              variant={"transparent"}
              className="text-neutral-600"
              onClick={(e) => handleButtonClick(e, nextTrack)}
            >
              <SkipForward />
            </Button>
          </div>
          {currentPlaylist[currentPlaylistIndex] ? (
            <div className="ml-2 hidden items-center gap-1 text-sm text-neutral-400 md:flex">
              <p>{formatDurationSec(position)}</p>
              <p>/</p>
              <p>{formatDurationSec(duration)}</p>
            </div>
          ) : (
            <div className="ml-2 hidden items-center gap-1 text-sm text-neutral-400 md:flex">
              <p>{formatDuration(0)}</p>
              <p>/</p>
              <p>{formatDuration(0)}</p>
            </div>
          )}
        </div>
        <div className="flex items-center truncate">
          {currentPlaylist[currentPlaylistIndex] ? (
            <CurrentTrackInfo
              imgUrl={currentPlaylist[currentPlaylistIndex].imageUrl}
              trackName={currentPlaylist[currentPlaylistIndex].title}
              artistName={currentPlaylist[currentPlaylistIndex].artist}
            />
          ) : (
            <p className="text-sm text-neutral-400">재생 중인 곡이 없습니다</p>
          )}
        </div>
        <div className="mr-6 flex items-center">
          {isCurrentChatRoomOpen ? (
            <Button
              variant={"transparent"}
              onClick={(e) => handleButtonClick(e, toggleCurrentChatRoomOpen)}
            >
              <ChevronDown />
            </Button>
          ) : (
            <Button
              variant={"transparent"}
              onClick={(e) => handleButtonClick(e, toggleCurrentChatRoomOpen)}
            >
              <ChevronUp />
            </Button>
          )}
        </div>
      </div>
      <YouTube
        opts={opts}
        videoId={currentPlaylist[currentPlaylistIndex] ? currentPlaylist[currentPlaylistIndex].videoId : ""}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className={"absolute"}
      />
    </div>
  );
}
