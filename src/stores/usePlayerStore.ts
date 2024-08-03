import { create } from "zustand";
import { SpotifyTrack } from "../utils/types";

interface PlayerStoreType {
  player: any;
  deviceId: string;
  setPlayer: (player: any) => void;
  setDeviceId: (deviceId: string) => void;
  currentPlaylist: SpotifyTrack[];
  currentPlaylistIndex: number;
  setCurrentPlaylist: (playlist: SpotifyTrack[]) => void;
  setCurrentPlaylistIndex: (index: number) => void;
  currentTrack: SpotifyTrack | null;
  paused: boolean;
  duration: number;
  position: number;
  repeat: boolean;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTrack: (track: SpotifyTrack) => void;
  setPaused: (paused: boolean) => void;
}

export const usePlayerStore = create<PlayerStoreType>((set) => ({
  // 플레이어 일반
  player: null,
  deviceId: "",
  setPlayer: (player: {}) => set({ player }),
  setDeviceId: (deviceId: string) => set({ deviceId }),

  // 현재 플레이리스트 정보
  currentPlaylist: [],
  currentPlaylistIndex: 0,
  setCurrentPlaylist: (currentPlaylist: any[]) => set({ currentPlaylist }),
  setCurrentPlaylistIndex: (currentPlaylistIndex: number) =>
    set({ currentPlaylistIndex }),

  // 재생 정보
  currentTrack: null,
  paused: true,
  duration: 0,
  position: 0,
  repeat: true,
  setPosition: (position: number) => set({ position }),
  setDuration: (duration: number) => set({ duration }),
  setCurrentTrack: (currentTrack: SpotifyTrack) => set({ currentTrack }),
  setPaused: (paused: boolean) => set({ paused }),
  setRepeat: (repeat: boolean) => set({ repeat }),
}));
