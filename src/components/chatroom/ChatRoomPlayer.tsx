import ChatRoomPlaylist from "./ChatRoomPlaylist";
import ChatRoomTrackInfo from "./ChatRoomTrackInfo";

export default function ChatRoomPlayer() {
  return <div className="flex flex-col size-full">
    <ChatRoomTrackInfo track={undefined} position={0} paused={false} />
    <ChatRoomPlaylist playlist={[]} currentPlaylistIndex={0} />
  </div>;
}
