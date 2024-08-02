import { create } from "zustand";

interface PlayerStoreType {
  player: any;
  deviceId: string;
  setPlayer: (player: any) => void;
  setDeviceId: (deviceId: string) => void;
  currentPlaylist: any[];
  currentPlaylistIndex: number;
  setCurrentPlaylist: (playlist: any[]) => void;
  setCurrentPlaylistIndex: (index: number) => void;
  currentTrack: any;
  paused: boolean;
  duration: number;
  position: number;
  repeat: boolean;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTrack: (track: any) => void;
  setPaused: (paused: boolean) => void;
}

export const usePlayerStore = create<PlayerStoreType>((set) => ({
  // 플레이어 일반
  player: {},
  deviceId: "",
  setPlayer: (player: {}) => set({ player }),
  setDeviceId: (deviceId: string) => set({ deviceId }),
  initializePlayer: () => {
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

      set({ player: player });

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        set({ deviceId: device_id });
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;

        set({
          currentTrack: state.track_window.current_track,
          paused: state.paused,
          duration: state.duration,
          position: state.position,
        });

        if (state.paused == true && state.position == 0) {
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
  },

  // 현재 플레이리스트 정보
  currentPlaylist: [],
  currentPlaylistIndex: 0,
  setCurrentPlaylist: (currentPlaylist: any[]) => set({ currentPlaylist }),
  setCurrentPlaylistIndex: (currentPlaylistIndex: number) => set({ currentPlaylistIndex }),

  // 재생 정보
  currentTrack: {},
  paused: true,
  duration: 0,
  position: 0,
  repeat: true,
  setPosition: (position: number) => set({ position }),
  setDuration: (duration: number) => set({ duration }),
  setCurrentTrack: (track: any) => set({ currentTrack: track }),
  setPaused: (paused: boolean) => set({ paused }),
  setRepeat: (repeat: boolean) => set({ repeat }),
}));
