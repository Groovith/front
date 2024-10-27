import { Track } from "./track.type";

export interface UserDetailsType {
  id: number;
  username: string;
  imageUrl: string;
  streaming: StreamingType;
  followerCount: number;
  followingCount: number;
}

export type StreamingType = "NONE" | "SPOTIFY";

export interface ChatRoomDetailsType {
  imageUrl: string;
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
  imageUrl: string;
  messageId: number;
  chatRoomId: number;
  content: string;
  userId: number;
  username: string;
  createdAt: string;
  type: "CHAT" | "JOIN" | "LEAVE" | "PLAYER";
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

export type PlayerActionRequestType =
  | "PLAY_NEW_TRACK"
  | "PAUSE"
  | "RESUME"
  | "PLAY_AT_INDEX"
  | "NEXT_TRACK"
  | "PREVIOUS_TRACK"
  | "SEEK"
  | "ADD_TO_CURRENT_PLAYLIST"
  | "REMOVE_FROM_CURRENT_PLAYLIST"
  | "TRACK_ENDED";

export type PlayerActionResponseType =
  | "PLAY_TRACK"
  | "PAUSE"
  | "RESUME"
  | "SEEK"
  | "UPDATE";

export interface PlayerDetailsDto {
  id: string | null;
  chatRoomId: number;
  userCount: number;
  currentPlaylistIndex: number;
  currentPlaylist: Track[];
  paused: boolean;
  repeat: boolean;
  position: number | null;
  duration: number | null;
}

export interface PlayerRequestDto {
  videoId?: string;
  index?: number | null;
  repeat?: boolean;
  position?: number | null;
  action: PlayerActionRequestType;
}

export interface PlayerResponseDto {
  action: PlayerActionResponseType;
  track?: Track;
  position?: number;
  currentPlaylist?: Track[];
  index?: number;
}
