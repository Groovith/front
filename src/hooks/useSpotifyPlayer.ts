import { usePlayerStore } from "../stores/usePlayerStore";
import {
  PlayerRequestDto,
  SpotifyTrack,
} from "../types/types";
import { addItemToPlaybackQueue, playTrack } from "../utils/apis/spotifyAPI";
import { useQueryClient } from "@tanstack/react-query";
import { useStompStore } from "../stores/useStompStore";

export function usePlayer() {
  const {
    player,
    deviceId,
    currentPlaylist,
    currentPlaylistIndex,
    position,
    repeat,
    paused,
    isListenTogetherConnected,
    listenTogetherId,
    setPlayer,
    setDeviceId,
    setPaused,
    setDuration,
    setPosition,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
    setLoading,
    decreaseCurrentPlaylistIndex,
  } = usePlayerStore();
  const queryClient = useQueryClient();
  const { stompClient } = useStompStore();

  // Spotify Web Playback SDK 초기화 및 리스너 추가
//   const initializePlayer = () => {
//     if (player) return;

//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;

//     document.body.appendChild(script);

//     let newPlayer: Spotify.Player;

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       newPlayer = new window.Spotify.Player({
//         name: "Groovith",
//         getOAuthToken: (cb: any) => {
//           cb(localStorage.getItem("spotifyAccessToken"));
//         },
//         volume: 0.5,
//       });

//       setPlayer(newPlayer);

//       newPlayer.addListener("ready", ({ device_id }: any) => {
//         console.log("Ready with Device ID", device_id);
//         setDeviceId(device_id);
//       });

//       newPlayer.addListener("not_ready", ({ device_id }: any) => {
//         console.log("Device ID has gone offline", device_id);
//       });

//       newPlayer.addListener("player_state_changed", (state: any) => {
//         if (!state) return;

//         console.log(state);

//         setPaused(state.paused);
//         setDuration(state.duration);
//         setPosition(state.position);
//       });

//       newPlayer.connect();
//     };

//     return () => {
//       if (newPlayer) {
//         newPlayer.disconnect();
//         setPlayer(null);
//       }
//     };
//   };

  // 플레이어 조작
  // 재생/일시 정지 토글
  // const togglePlay = (force?: boolean) => {
  //   if (force) {
  //     player.togglePlay();
  //     return;
  //   }

  //   if (isListenTogetherConnected && listenTogetherId) {
  //     const requestDto: PlayerRequestDto = {
  //       paused: !paused,
  //       position: position,
  //       action: "TOGGLE_PLAY",
  //     };
  //     sendPlayerMessage(listenTogetherId, requestDto);
  //   } else {
  //     player.togglePlay();
  //   }
  // };

  // 플레이어 정지
  const pausePlayer = (force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      player.pause();
      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        position: position,
        action: "PAUSE",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      player.pause();
    }
  };

  // 플레이어 다시 재생
  const resumePlayer = (force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      player.resume();
      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        position: position,
        action: "RESUME",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      player.resume();
    }
  };

  // 트랙 종료 메시지
  const trackEnded = () => {
    const requestDto: PlayerRequestDto = {
      action: "TRACK_ENDED",
    };
    if (isListenTogetherConnected && listenTogetherId) {
      sendPlayerMessage(listenTogetherId, requestDto);
    }
  };

  // 트랙 그냥 재생 (player.resume() 추가를 위해 만듦)
  const justPlayTrack = async (track: SpotifyTrack, position?: number) => {
    if (!(player instanceof Spotify.Player)) return;
    try {
      if (position) {
        await playTrack(track.uri, deviceId, position);
      } else {
        await playTrack(track.uri, deviceId, 1);
      }
      setTimeout(() => {
        player.resume().then(() => {
          if (typeof position === "number") {
            player.seek(position);
          }
        });
      }, 500); // 잠시 후 메뉴얼 정지
    } catch (e) {
      console.error("justPlayTrack 에러: ", e);
    }
  };

  // 새로운 트랙 재생. 플레이리스트 초기화
  const playNewTrack = async (track: SpotifyTrack, force?: boolean) => {
    if (force) {
      setPosition(0);
      setCurrentPlaylistIndex(0);
      //setCurrentPlaylist([track]);
      setPaused(false);
      setLoading(true);
      try {
        await justPlayTrack(track);
      } finally {
        setLoading(false);
      }

      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "PLAY_NEW_TRACK",
        track: track,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      setPosition(0);
      setCurrentPlaylistIndex(0);
      //setCurrentPlaylist([track]);
      setDuration(track.duration_ms);
      setPaused(false);
      setLoading(true);
      try {
        await justPlayTrack(track);
      } finally {
        setLoading(false);
      }
    }
  };

  // 특정 위치로 이동
  const seek = async (position: number, force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      player.seek(position).then(() => {
        setPosition(position);
      });
      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "SEEK",
        position: position,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      player.seek(position).then(() => {
        setPosition(position);
      });
    }
  };

  // 특정 인덱스의 트랙 재생
  const playAtIndex = async (index: number, force?: boolean) => {
    if (force) {
      if (index >= 0 && index < currentPlaylist.length) {
        try {
          //await justPlayTrack(currentPlaylist[index]);
          setCurrentPlaylistIndex(index);
        } catch (e) {
          console.log(e);
        }
      }

      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "PLAY_AT_INDEX",
        index: index,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      if (index >= 0 && index < currentPlaylist.length) {
        try {
          //await justPlayTrack(currentPlaylist[index]);
          setCurrentPlaylistIndex(index);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  // 다음 곡 재생
  const nextTrack = async (force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      const nextIndex = currentPlaylistIndex + 1;
      if (nextIndex < currentPlaylist.length) {
        // 다음 곡이 있는 경우
        await playAtIndex(nextIndex);
      } else if (repeat) {
        // 다음 곡이 없지만 반복재생이 설정되어 있는 경우
        await playAtIndex(0);
      } else {
        // 다음 곡이 없고 반복재생이 설정되어 있지 않은 경우
        player.seek(0).then(() => {
          player.pause();
        });
      }
      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "NEXT_TRACK",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      const nextIndex = currentPlaylistIndex + 1;
      if (nextIndex < currentPlaylist.length) {
        // 다음 곡이 있는 경우
        await playAtIndex(nextIndex);
      } else if (repeat) {
        // 다음 곡이 없지만 반복재생이 설정되어 있는 경우
        await playAtIndex(0);
      } else {
        // 다음 곡이 없고 반복재생이 설정되어 있지 않은 경우
        player.seek(0).then(() => {
          player.pause();
        });
      }
    }
  };

  // 이전 곡 재생
  const previousTrack = async (force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      if (position > 3000) {
        // 3초보다 지났으면 처음으로
        player.seek(0); // 현재 트랙을 처음부터 다시 재생
        return;
      }

      const previousIndex = currentPlaylistIndex! - 1;
      if (previousIndex >= 0) {
        await playAtIndex(previousIndex);
      } else {
        player.seek(0);
      }

      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "PREVIOUS_TRACK",
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      if (position > 3000) {
        // 3초를 밀리초로 변환
        player.seek(0); // 현재 트랙을 처음부터 다시 재생
        return;
      }

      const previousIndex = currentPlaylistIndex! - 1;
      if (previousIndex >= 0) {
        await playAtIndex(previousIndex);
      } else {
        player.seek(0);
      }
    }
  };

  // 현재 유저 플레이백 큐에 추가
  const addToPlaybackQueue = async (track: SpotifyTrack) => {
    try {
      addItemToPlaybackQueue(track.uri, deviceId).then(() => {
        queryClient.invalidateQueries({ queryKey: ["userQueue"] });
      });
    } catch (e) {
      console.error("addToPlaybackQueue error: ", e);
    }
  };

  // 현재 재생목록 관련

  // 현재 재생목록에 추가
  const addToCurrentPlaylist = async (track: SpotifyTrack, force?: boolean) => {
    if (force) {
      const updatedCurrentPlaylist = [...currentPlaylist, track];
      //setCurrentPlaylist(updatedCurrentPlaylist);
      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "ADD_TO_CURRENT_PLAYLIST",
        track: track,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      const updatedCurrentPlaylist = [...currentPlaylist, track];
      //setCurrentPlaylist(updatedCurrentPlaylist);
      // 실행 중인 곡이 없을 때 첫번째 곡을 재생
      if (!currentPlaylist[currentPlaylistIndex]) {
        setCurrentPlaylistIndex(0);
        playAtIndex(0);
      }
    }
  };

  // 현재 재생목록에서 삭제
  const removeFromCurrentPlaylist = async (index: number, force?: boolean) => {
    if (!(player instanceof Spotify.Player)) return;

    if (force) {
      const updatedCurrentPlaylist = [...currentPlaylist];
      updatedCurrentPlaylist.splice(index, 1);
      setCurrentPlaylist(updatedCurrentPlaylist);

      const isCurrentTrackDeleted = index === currentPlaylistIndex;
      const isLastTrackDeleted = updatedCurrentPlaylist.length === 0;

      if (isCurrentTrackDeleted) {
        if (isLastTrackDeleted) {
          // 재생 목록이 비어있다면 정지
          setPaused(true);
          player.pause(); // 재생을 멈추는 로직 추가
        } else {
          // 다음 트랙을 재생
          const newIndex =
            index >= updatedCurrentPlaylist.length
              ? updatedCurrentPlaylist.length - 1
              : index;
          setCurrentPlaylistIndex(newIndex);
          playAtIndex(newIndex, true); // 다음 곡을 재생
        }
      } else if (index < currentPlaylistIndex) {
        // 삭제된 인덱스가 현재 재생 인덱스보다 앞에 있으면 currentPlaylistIndex를 하나 줄임
        decreaseCurrentPlaylistIndex(1);
      }

      return;
    }

    if (isListenTogetherConnected && listenTogetherId) {
      const requestDto: PlayerRequestDto = {
        action: "REMOVE_FROM_CURRENT_PLAYLIST",
        index: index,
      };
      sendPlayerMessage(listenTogetherId, requestDto);
    } else {
      const updatedCurrentPlaylist = [...currentPlaylist];
      updatedCurrentPlaylist.splice(index, 1);
      setCurrentPlaylist(updatedCurrentPlaylist);

      const isCurrentTrackDeleted = index === currentPlaylistIndex;
      const isLastTrackDeleted = updatedCurrentPlaylist.length === 0;

      if (isCurrentTrackDeleted) {
        if (isLastTrackDeleted) {
          // 재생 목록이 비어있다면 정지
          setPaused(true);
          player.pause(); // 재생을 멈추는 로직 추가
        } else {
          // 다음 트랙을 재생
          const newIndex =
            index >= updatedCurrentPlaylist.length
              ? updatedCurrentPlaylist.length - 1
              : index;
          setCurrentPlaylistIndex(newIndex);
          playAtIndex(newIndex, true); // 다음 곡을 재생
        }
      } else if (index < currentPlaylistIndex) {
        // 삭제된 인덱스가 현재 재생 인덱스보다 앞에 있으면 currentPlaylistIndex를 하나 줄임
        decreaseCurrentPlaylistIndex(1);
      }
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
    initializePlayer,
    playNewTrack,
    playAtIndex,
    nextTrack,
    previousTrack,
    addToCurrentPlaylist,
    removeFromCurrentPlaylist,
    seek,
    addToPlaybackQueue,
    trackEnded,
    pausePlayer,
    resumePlayer,
    justPlayTrack,
  };
}
