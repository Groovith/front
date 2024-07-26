import axios from "axios";
import { usePlayerStore } from "../stores/usePlayerStore";

export function usePlayer() {
  const {
    player,
    deviceId,
    currentPlaylist,
    currentPlaylistIndex,
    position,
    repeat,
    setPlayer,
    setDeviceId,
    setCurrentTrack,
    setPaused,
    setDuration,
    setPosition,
    setCurrentPlaylist,
    setCurrentPlaylistIndex,
  } = usePlayerStore();

  // Spotify Web Playback SDK 초기화 및 리스너 추가
  const initializePlayer = () => {
    let player: any;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: any) => {
          cb(localStorage.getItem("spotifyAccessToken"));
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setPaused(state.paused);
        setDuration(state.duration);
        setPosition(state.position);

        if (state.paused === true && state.position === 0) {
          console.log("Track Ended!");
        }
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  };

  // 플레이어 조작
  // 재생/일시 정지 토글
  const togglePlay = () => {
    player.togglePlay();
  };

  // 트랙 재생 요청 API
  const playTrack = async (track: any) => {
    try {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${
        deviceId
      }`;
      const body = {
        // context_uri: track.album.uri,
        // offset: { uri: track.uri },
        uris: [track.uri],
      };

      await axios.put(url, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("트랙 재생 에러: ", e);
    }
  };

  // 새로운 트랙 재생. 플레이리스트 초기화
  const playNewTrack = async (track: any) => {
    setCurrentPlaylist([track]);
    setCurrentPlaylistIndex(0);
    await playTrack(track);
  };

  // 특정 위치로 이동
  const seek = (position: number) => {
    player.seek(position).then(() => {
      setPosition(position);
    });
  };

  // 특정 인덱스의 트랙 재생
  const playAtIndex = async (index: number) => {
    if (index >= 0 && index < currentPlaylist.length) {
      await playTrack(currentPlaylist[index]);
      setCurrentPlaylistIndex(index);
    }
  };

  // 다음 곡 재생
  const nextTrack = async () => {
    const nextIndex = currentPlaylistIndex + 1;

    if (nextIndex < currentPlaylist.length) {
      // 다음 곡이 있는 경우
      await playAtIndex(nextIndex);
      setCurrentPlaylistIndex(nextIndex);
    } else if (repeat) {
      // 다음 곡이 없지만 반복재생이 설정되어 있는 경우
      await playAtIndex(0);
      setCurrentPlaylistIndex(0);
    } else {
      // 다음 곡이 없고 반복재생이 설정되어 있지 않은 경우
      seek(0);
    }
  };

  // 이전 곡 재생
  const previousTrack = async () => {
    if (position > 3000) {
      // 3초를 밀리초로 변환
      seek(0); // 현재 트랙을 처음부터 다시 재생
      return;
    }

    const previousIndex = currentPlaylistIndex - 1;
    if (previousIndex >= 0) {
      await playAtIndex(previousIndex);
      setCurrentPlaylistIndex(previousIndex);
    } else {
      seek(0);
    }
  };

  // 현재 재생목록 관련
  // 현재 재생목록에 추가
  const addToCurrentPlaylist = (track: any) => {
    const updatedCurrentPlaylist = [...currentPlaylist, track];
    setCurrentPlaylist(updatedCurrentPlaylist);
  }

  // 현재 재생목록에서 삭제
  const removeFromCurrentPlaylist = (index: number) => {
    const updatedCurrentPlaylist = [...currentPlaylist];
    updatedCurrentPlaylist.splice(index, 1);
    setCurrentPlaylist(updatedCurrentPlaylist);
  }

  return { initializePlayer, playNewTrack, playAtIndex, nextTrack, previousTrack, addToCurrentPlaylist, removeFromCurrentPlaylist };
}
