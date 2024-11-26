import { toast } from "sonner";
import { usePlayerStore } from "../stores/usePlayerStore";
import { getTrackInfo } from "../utils/apis/serverAPI";
import { PlayerRequestDto } from "../types/types";
import { useStompStore } from "../stores/useStompStore";
import YouTube from "react-youtube";

export function usePlayer() {
  const {
    player,
    position,
    repeat,
    currentPlaylist,
    currentPlaylistIndex,
    listenTogetherId,
    setPaused,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    decreaseCurrentPlaylistIndex,
  } = usePlayerStore();
  const { stompClient } = useStompStore();

  const resumePlayer = () => {
    if (!player?.current) return;

    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        position: position,
        action: "RESUME",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    player.current.target.playVideo();
  };

  const pausePlayer = () => {
    if (!player?.current) return;

    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        position: position,
        action: "PAUSE",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    player.current.target.pauseVideo();
  };

  const stopPlayer = () => {
    if (!player?.current) return;

    player.current.target.stopVideo();
  };

  const seek = (position: number) => {
    if (!player?.current) return;

    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        position: position,
        action: "SEEK",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    player.current.target.seekTo(position);
  };

  const playAtIndex = (index: number) => {
    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        index: index,
        action: "PLAY_AT_INDEX",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    if (index >= 0 && index < currentPlaylist.length) {
      try {
        setCurrentPlaylistIndex(index);
        player?.current?.target.loadVideoById({
          videoId: currentPlaylist[index].videoId,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const trackEnded = () => {
    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "TRACK_ENDED",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    nextTrack(true);
  };

  const nextTrack = (force?: boolean) => {
    if (listenTogetherId && !force) {
      const requestDto: PlayerRequestDto = {
        action: "NEXT_TRACK",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    const nextIndex = currentPlaylistIndex + 1;
    if (nextIndex < currentPlaylist.length) {
      // 다음 곡이 있는 경우
      playAtIndex(nextIndex);
    } else if (repeat) {
      // 다음 곡이 없지만 반복재생이 설정되어 있는 경우
      playAtIndex(0);
    } else {
      // 다음 곡이 없고 반복재생이 설정되어 있지 않은 경우
      stopPlayer();
      setPaused(true);
    }
  };

  const previousTrack = () => {
    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "PREVIOUS_TRACK",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    if (position && position > 3000) {
      // 3초보다 지났으면 처음으로
      seek(0); // 현재 트랙을 처음부터 다시 재생
      return;
    }

    const previousIndex = currentPlaylistIndex! - 1;
    if (previousIndex >= 0) {
      playAtIndex(previousIndex);
    } else {
      seek(0);
    }
  };

  const addToCurrentPlaylist = async (videoId: string) => {
    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "ADD_TO_CURRENT_PLAYLIST",
        videoId: videoId,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    try {
      const response = await getTrackInfo(videoId);
      const updatedCurrentPlaylist = [...currentPlaylist, response];
      setCurrentPlaylist(updatedCurrentPlaylist);
      // 플레이리스트가 비어있던 경우 자동 재생
      if (
        player?.current?.target.getPlayerState() ===
        YouTube.PlayerState.UNSTARTED
      ) {
        player.current.target.loadVideoById({
          videoId: videoId,
        });
      }
    } catch (e) {
      toast.error("음악 추가 중 문제가 발생하였습니다.");
    }
    return;
  };

  const removeFromCurrentPlaylist = (index: number) => {
    if (listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "REMOVE_FROM_CURRENT_PLAYLIST",
        index: index,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
      return;
    }

    const updatedCurrentPlaylist = [...currentPlaylist];
    updatedCurrentPlaylist.splice(index, 1);
    setCurrentPlaylist(updatedCurrentPlaylist);

    const isCurrentTrackDeleted = index === currentPlaylistIndex;
    const isLastTrackDeleted = updatedCurrentPlaylist.length === 0;

    if (isCurrentTrackDeleted) {
      if (isLastTrackDeleted) {
        // 재생 목록이 비어있다면 정지
        setPaused(true);
        pausePlayer(); // 재생을 멈추는 로직 추가
      } else {
        // 다음 트랙을 재생
        const newIndex =
          index >= updatedCurrentPlaylist.length
            ? updatedCurrentPlaylist.length - 1
            : index;
        setCurrentPlaylistIndex(newIndex);
        playAtIndex(newIndex); // 다음 곡을 재생
      }
    } else if (index < currentPlaylistIndex) {
      // 삭제된 인덱스가 현재 재생 인덱스보다 앞에 있으면 currentPlaylistIndex를 하나 줄임
      decreaseCurrentPlaylistIndex(1);
    }
  };

  // STOMP 플레이어 메시지 전송
  const sendPlayerMessage = (
    chatRoomId: string | number,
    requestDto: PlayerRequestDto,
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!stompClient || !accessToken) return;

    stompClient.publish({
      destination: `/pub/api/chatrooms/${chatRoomId}/player/listen-together`,
      body: JSON.stringify(requestDto),
      headers: { access: accessToken },
    });
  };

  return {
    addToCurrentPlaylist,
    removeFromCurrentPlaylist,
    seek,
    resumePlayer,
    pausePlayer,
    stopPlayer,
    nextTrack,
    previousTrack,
    playAtIndex,
    trackEnded,
  };
}
