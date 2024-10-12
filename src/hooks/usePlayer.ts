import { usePlayerStore } from "../stores/usePlayerStore";

export function usePlayer() {
  const {
    player,
    position,
    repeat,
    currentPlaylist,
    currentPlaylistIndex,
    setPaused,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    decreaseCurrentPlaylistIndex,
  } = usePlayerStore();

  const resumePlayer = () => {
    if (!player?.current) return;

    player.current.target.playVideo();
  };

  const pausePlayer = () => {
    if (!player?.current) return;

    player.current.target.pauseVideo();
  };

  const stopPlayer = () => {
    if (!player?.current) return;

    player.current.target.stopVideo();
  };

  const seek = (position: number) => {
    if (!player?.current) return;

    player.current.target.seekTo(position);
  };

  const playAtIndex = (index: number) => {
    if (index >= 0 && index < currentPlaylist.length) {
      try {
        setCurrentPlaylistIndex(index);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const nextTrack = () => {
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
    if (position > 3000) {
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

  const addToCurrentPlaylist = (videoId: string): void => {
    const updatedCurrentPlaylist = [...currentPlaylist, videoId];
    setCurrentPlaylist(updatedCurrentPlaylist);
    return;
  };

  const removeFromCurrentPlaylist = (index: number) => {
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

  return {
    addToCurrentPlaylist,
    removeFromCurrentPlaylist,
    seek,
    resumePlayer,
    pausePlayer,
    nextTrack,
    previousTrack,
    playAtIndex,
  };
}
