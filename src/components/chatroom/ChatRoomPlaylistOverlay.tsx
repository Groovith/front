import { ListPlus, X } from "lucide-react";
import { Button } from "../Button";

interface ChatRoomPlaylistOverlayProps {
  show: boolean;
  togglePlaylist: () => void;
  height?: number;
}

export default function ChatRoomPlaylistOverlay({
  show,
  togglePlaylist,
  height = 0, // 기본값을 0으로 설정
}: ChatRoomPlaylistOverlayProps) {
  return (
    <div
      className={`fixed right-0 z-30 w-full bg-neutral-800 transition-transform duration-300 ease-in-out ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ height: height }} // 동적으로 높이 설정
    >
      <div className="flex justify-between px-5 py-8 text-white items-center">
        <h2 className="text-lg font-semibold">재생목록</h2>
        <div className="flex items-center justify-between gap-2">
          <Button variant={"ghost"} className="text-white p-1">
            <ListPlus />
          </Button>
          <Button variant={"ghost"} className="text-white p-1" onClick={togglePlaylist}>
            <X />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto px-5" style={{ maxHeight: height - 80 }}>
        {/* 재생목록 아이템들 */}
        <ul className="space-y-5">
          <li className="text-white">곡 1</li>
          <li className="text-white">곡 2</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>
          <li className="text-white">곡 3</li>

          {/* 여기에 재생목록 아이템을 렌더링 */}
        </ul>
      </div>
    </div>
  );
}
