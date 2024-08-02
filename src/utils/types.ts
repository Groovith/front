export interface UserDetailsType {
  id: number;
  username: string;
  streaming: StreamingType;
}

export type StreamingType = "NONE" | "SPOTIFY";

export interface ChatRoomDetailsType {
  chatRoomId: number;
  name: string;
  totalUsers: number;
  currentUsers: number;
  masterId: number;
  playListId: number;
  playListIndex: number;
  position: number;
  paused: boolean;
  status: "PRIVATE" | "FRIENDS" | "PUBLIC";
  messages: MessageType[];
}

export interface MessageType {
  messageId: number;
  chatRoomId: number;
  content: string;
  userId: number;
  username: string;
  type: "CHAT" | "JOIN" | "LEAVE" | "PLAYER";
  command?: "PLAY" | "TOGGLE";
  track?: string;
}
