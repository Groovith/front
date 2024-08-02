import { Client } from "@stomp/stompjs";
import { create } from "zustand";

interface StompStoreType {
  stompClient: Client | null;
  setStompClient: (stompClient: Client) => void;
}

export const useStompStore = create<StompStoreType>((set) => ({
  stompClient: null,
  setStompClient: (stompClient: Client) => set({ stompClient }),
}));
