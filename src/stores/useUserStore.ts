import { create } from "zustand";

interface UserStoreType {
  userId: number | null;
  username: string | null;
  setUserId: (userId: number) => void;
  setUsername: (username: string) => void;
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
}));
