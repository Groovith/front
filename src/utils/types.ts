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
  createdAt: string;
  type: "CHAT" | "JOIN" | "LEAVE" | "PLAYER";
  command?: "PLAY" | "TOGGLE";
  track?: string;
}

// 스포티파이 관련 타입
export interface SpotifySearchResponse {
  tracks: {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: SpotifySimplifiedArtist[];
}

export interface SpotifySimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifySimplifiedArtist[];
  disc_number: 1;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: number;
    eam: number;
    upc: number;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: {};
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}