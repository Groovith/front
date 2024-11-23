import { useState } from "react";
import {
  ChatRoomPrivacyType,
  ChatRoomPlayerPermissionType,
} from "../../utils/apis/serverAPI";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { ChatRoomDetailsType } from "../../types/types";
import { toast } from "sonner";
import { updateChatRoom } from "../../utils/apis/chatroom/updateChatRoom.api";
import imageCompression from "browser-image-compression";
import { X, ImagePlus } from "lucide-react";

interface ChatRoomSettingsModalProps {
  chatRoomDetails: ChatRoomDetailsType;
  onClose: () => void;
  refetch: () => void;
}

export default function ChatRoomSettingsModal({
  chatRoomDetails,
  onClose,
  refetch,
}: ChatRoomSettingsModalProps) {
  const [newChatRoomName, setNewChatRoomName] = useState(chatRoomDetails?.name);
  const [chatRoomVisibility, setChatRoomVisibility] =
    useState<ChatRoomPrivacyType>("PUBLIC");
  const [chatRoomPermission, setChatRoomPermission] =
    useState<ChatRoomPlayerPermissionType>("EVERYONE");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>(chatRoomDetails.imageUrl);

  const handleCreateNewChatRoom = async () => {
    if (newChatRoomName.trim()) {
      try {
        await updateChatRoom(
          chatRoomDetails.chatRoomId,
          {
            name: newChatRoomName,
            status: chatRoomVisibility,
            permission: chatRoomPermission,
          },
          file,
        );
        toast.success("변경 사항을 저장하였습니다.");
        refetch();
        onClose();
      } catch (e) {
        console.error(e);
        toast.error("채팅방 설정 저장 중 문제가 발생하였습니다.");
      }
    } else {
      toast.error("채팅방 이름을 입력해주세요.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // 이미지 파일 형식 확인 (JPG, PNG 등)
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "허용되지 않는 파일 형식입니다. JPG, PNG 형식만 지원됩니다.",
        );
        return;
      }

      // 이미지 압축 옵션 설정
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImage(imageUrl);
        setFile(compressedFile);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteImage = () => {
    setImage("");
    setFile(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // 파일 입력 필드 값 초기화
    }
  };

  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">채팅방 설정</h1>
        </div>

        {/* 채팅방 사진 */}
        <div className="relative flex h-fit w-full justify-center py-5">
          {image ? (
            <div className="relative flex size-fit">
              <img
                src={image}
                alt="Image"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="size-24 rounded-full border border-neutral-300 bg-neutral-100 object-cover hover:cursor-pointer"
              />
              <Button
                variant={"white"}
                className="absolute bottom-0 right-0 size-fit p-1"
                onClick={handleDeleteImage}
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <Button
              className="flex size-24 items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <ImagePlus />
            </Button>
          )}
          <input
            type="file"
            id="fileInput"
            onChange={(e) => handleImageUpload(e)}
            hidden
          />
        </div>

        {/* 채팅방 이름 입력 */}
        <h2 className="mb-2">채팅방 이름</h2>
        <input
          type="text"
          className="mb-6 w-full rounded-md border border-neutral-400 p-2 placeholder:text-neutral-500"
          placeholder="채팅방 이름"
          value={newChatRoomName}
          onChange={(e) => setNewChatRoomName(e.target.value)}
        />

        {/* 채팅방 공개 여부 선택 */}
        <div className="mb-6">
          <p className="mb-3 font-medium">채팅방 공개 여부</p>
          <div className="flex flex-col gap-3">
            <label className="flex items-start">
              <input
                type="radio"
                name="visibility"
                value="PUBLIC"
                checked={chatRoomVisibility === "PUBLIC"}
                onChange={() => setChatRoomVisibility("PUBLIC")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <div className="ml-3 flex flex-col justify-start gap-1">
                <span className="font-medium">공개</span>
                <p className="text-xs font-normal text-gray-500">
                  검색을 통해 채팅방을 찾을 수 있고, 참여할 수 있습니다.
                </p>
              </div>
            </label>
            <label className="flex items-start">
              <input
                type="radio"
                name="visibility"
                value="PRIVATE"
                checked={chatRoomVisibility === "PRIVATE"}
                onChange={() => setChatRoomVisibility("PRIVATE")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <div className="ml-3 flex flex-col justify-start gap-1">
                <span className="font-medium">비공개</span>
                <p className="text-xs font-normal text-gray-500">
                  검색을 통해 채팅방을 찾을 수 없으며, 초대를 통해서만 참여할 수
                  있습니다.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 음악 플레이어 권한 선택 */}
        <div className="mb-6">
          <p className="mb-3 font-medium">음악 플레이어 권한</p>
          <div className="flex flex-col gap-3">
            <label className="flex items-start">
              <input
                type="radio"
                name="permission"
                value="EVERYONE"
                checked={chatRoomPermission === "EVERYONE"}
                onChange={() => setChatRoomPermission("EVERYONE")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <div className="ml-3 flex flex-col justify-start gap-1">
                <span className="font-medium">모두</span>
                <p className="text-xs font-normal text-gray-500">
                  채팅방에 참가한 모든 사용자가 음악을 정지/재생, 추가/삭제할 수
                  있습니다.
                </p>
              </div>
            </label>
            <label className="flex items-start">
              <input
                type="radio"
                name="permission"
                value="MASTER"
                checked={chatRoomPermission === "MASTER"}
                onChange={() => setChatRoomPermission("MASTER")}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <div className="ml-3 flex flex-col justify-start gap-1">
                <span className="font-medium">방장만</span>
                <p className="text-xs font-normal text-gray-500">
                  채팅방 방장만 음악을 정지/재생, 추가/삭제할 수 있습니다.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-end gap-4">
          <Button
            variant={"ghost"}
            onClick={onClose}
            className="w-full border px-5"
          >
            취소
          </Button>
          <Button onClick={handleCreateNewChatRoom} className="w-full px-5">
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
