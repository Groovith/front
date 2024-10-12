import { create } from "zustand";
import { StreamingType } from "../types/types";

interface UserStoreType {
  userId: number | null;
  username: string | null;
  streaming: StreamingType;
  setUserId: (userId: number) => void;
  setUsername: (username: string) => void;
  setStreaming: (streaming: StreamingType) => void;
}

/**
 * 현재 로그인한 유저 관련 정보
 */
export const useUserStore = create<UserStoreType>((set) => ({
  userId: null,
  username: null,
  streaming: "NONE",
  setUserId: (userId: number) => set({ userId }),
  setUsername: (username: string) => set({ username }),
  setStreaming: (streaming: StreamingType) => set({ streaming }),
}));
