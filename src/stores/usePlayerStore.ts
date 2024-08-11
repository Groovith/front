import { create } from "zustand";
import {
  PlayerResponseDto,
  SpotifyTrack,
} from "../utils/types";
import { StompSubscription } from "@stomp/stompjs";

interface PlayerStoreType {
  player: Spotify.Player | null;
  deviceId: string;
  setPlayer: (player: Spotify.Player | null) => void;
  setDeviceId: (deviceId: string) => void;
  currentPlaylist: SpotifyTrack[];
  currentPlaylistIndex: number;
  setCurrentPlaylist: (playlist: SpotifyTrack[]) => void;
  setCurrentPlaylistIndex: (index: number) => void;
  decreaseCurrentPlaylistIndex: (amount: number) => void;
  paused: boolean;
  duration: number;
  position: number;
  repeat: boolean;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setPaused: (paused: boolean) => void;
  setRepeat: (repeat: boolean) => void;
  isListenTogetherConnected: boolean;
  listenTogetherId: number | null;
  listenTogetherSubscription: StompSubscription | null;
  setIsListenTogetherConnected: (isListenTogetherConnected: boolean) => void;
  setListenTogetherId: (listenTogetherId: number) => void;
  setListenTogetherSubscription: (
    listenTogetherSubscription: StompSubscription,
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  playerResponseMessage: PlayerResponseDto | null;
  setPlayerResponseMessage: (playerResponseMessage: PlayerResponseDto) => void;
}

export const usePlayerStore = create<PlayerStoreType>((set) => ({
  // 플레이어 일반
  player: null,
  deviceId: "",
  setPlayer: (player: Spotify.Player | null) => set({ player }),
  setDeviceId: (deviceId: string) => set({ deviceId }),

  // 현재 플레이리스트 정보
  currentPlaylist: [],
  currentPlaylistIndex: 0,
  setCurrentPlaylist: (currentPlaylist: any[]) => set({ currentPlaylist }),
  setCurrentPlaylistIndex: (currentPlaylistIndex: number) =>
    set({ currentPlaylistIndex }),
  decreaseCurrentPlaylistIndex: (amount) =>
    set((state) => ({
      currentPlaylistIndex: state.currentPlaylistIndex - amount,
    })),

  // 재생 정보
  paused: true,
  duration: 0,
  position: 0,
  repeat: false,
  loading: false,
  setPosition: (position: number) => set({ position }),
  setDuration: (duration: number) => set({ duration }),
  setPaused: (paused: boolean) => set({ paused }),
  setRepeat: (repeat: boolean) => set({ repeat }),
  setLoading: (loading: boolean) => set({ loading }),

  // 같이 듣기
  isListenTogetherConnected: false,
  listenTogetherId: null,
  listenTogetherSubscription: null,
  setIsListenTogetherConnected: (isListenTogetherConnected: boolean) =>
    set({ isListenTogetherConnected }),
  setListenTogetherId: (listenTogetherId: number) => set({ listenTogetherId }),
  setListenTogetherSubscription: (
    listenTogetherSubscription: StompSubscription,
  ) => set({ listenTogetherSubscription }),
  playerResponseMessage: null,
  setPlayerResponseMessage: (playerResponseMessage: PlayerResponseDto) =>
    set({ playerResponseMessage }),
}));
