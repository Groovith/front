import { X } from "lucide-react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { useState } from "react";
import getVideoId from "get-video-id";
import { usePlayer } from "../../hooks/usePlayer";
import { toast } from "sonner";

interface AddTrackModalProps {
  addTrackModalVisible: boolean;
  setAddTrackModalVisible: (v: boolean) => void;
}

export default function AddTrackModal({
  addTrackModalVisible,
  setAddTrackModalVisible,
}: AddTrackModalProps) {
  const [youTubeUrl, setYouTubeUrl] = useState("");
  const handleAddTrack = () => {
    const videoId = getVideoId(youTubeUrl);
    if (!videoId.id || videoId.service !== "youtube") {
      toast.error("잘못된 URL 형식입니다.");
    } else {
      toast("곡을 추가하였습니다.");
      addToCurrentPlaylist(videoId.id);
      setAddTrackModalVisible(false);
      setYouTubeUrl("");
    }
  };
  const { addToCurrentPlaylist } = usePlayer();
  return (
    <>
      {addTrackModalVisible && (
        <Modal
          onClose={() => setAddTrackModalVisible(false)}
          closeOnOutsideClick={true}
        >
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-neutral-900 mb-3">음악 추가</p>
            <p className="mb-5 text-neutral-600">
              유튜브 링크를 입력하여 음악을 추가하세요.
            </p>
            <div className="flex flex-col gap-5">
              <input
                id="youtube-url-input"
                type="text"
                className="rounded-xl border p-3"
                placeholder="https://..."
                value={youTubeUrl}
                onChange={(e) => setYouTubeUrl(e.target.value)}
              />
              <div className="flex w-full justify-between gap-2">
                <Button
                  onClick={() => setAddTrackModalVisible(false)}
                  className="w-full bg-white text-neutral-900 border"
                >
                  취소
                </Button>
                <Button onClick={handleAddTrack} className="w-full">추가하기</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
