import { create } from "zustand";
import { ChatRoomDetailsType, MessageType } from "../types/types";

interface useChatRoomStoreType {
  chatRoomList: ChatRoomDetailsType[];
  currentChatRoomId: number;
  currentChatRoomMessages: MessageType[];
  newMessage: MessageType | null;
  isCurrentChatRoomOpen: boolean;
  setChatRoomList: ([]: ChatRoomDetailsType[]) => void;
  setCurrentChatRoomId: (currentChatRoomId: number) => void;
  setCurrentChatRoomMessages: ([]: MessageType[]) => void;
  setNewMessage: (newMessage: MessageType) => void;
  toggleCurrentChatRoomOpen: () => void;
  getChatRoomById: (chatRoomId: number) => ChatRoomDetailsType | undefined;
  addToCurrentChatRoomMessages: (message: MessageType) => void;
}

export const useChatRoomStore = create<useChatRoomStoreType>((set, get) => ({
  chatRoomList: [],
  currentChatRoomId: -1,
  currentChatRoomMessages: [],
  newMessage: null,
  isCurrentChatRoomOpen: false,
  setChatRoomList: (chatRoomList: ChatRoomDetailsType[]) =>
    set({ chatRoomList }),
  setCurrentChatRoomId: (currentChatRoomId: number) =>
    set({ currentChatRoomId }),
  setCurrentChatRoomMessages: (currentChatRoomMessages: MessageType[]) =>
    set({ currentChatRoomMessages }),
  setNewMessage: (newMessage: MessageType) => set({ newMessage }),
  toggleCurrentChatRoomOpen: () =>
    set((state) => ({ isCurrentChatRoomOpen: !state.isCurrentChatRoomOpen })),
  getChatRoomById: (chatRoomId: number) =>
    get().chatRoomList.find((chatRoom) => chatRoom.chatRoomId === chatRoomId),
  addToCurrentChatRoomMessages: (message: MessageType) => {
    const currentChatRoomMessages = get().currentChatRoomMessages;

    // 같은 id의 메시지가 있는지 확인
    const messageExists = currentChatRoomMessages.some(
      (msg) => msg.messageId === message.messageId,
    );

    // 중복되지 않은 경우에만 추가
    if (!messageExists) {
      set({ currentChatRoomMessages: [...currentChatRoomMessages, message] });
    }
  },
}));
