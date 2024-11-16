import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { UserDetailsType } from "../../types/types";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "../../utils/apis/serverAPI";
import { Button } from "../Button";
import { Modal } from "../Modal";

interface ProfileModalProps {
  userDetails: UserDetailsType | undefined;
  refetch: () => void;
  onClose: () => void;
  onUsernameChangeClick: () => void;
}

export default function ProfileModal({
  userDetails,
  refetch,
  onClose,
  onUsernameChangeClick,
}: ProfileModalProps) {
  const handleFileChangeAndUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // 이미지 파일 형식 확인 (JPG, PNG, GIF 등)
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
        console.log(compressedFile.size);
        await uploadProfileImage(compressedFile);
        refetch();
        toast.success("프로필 사진이 변경되었습니다.");
      } catch (e) {
        console.error(e);
        toast.error("프로필 사진 업로드 중 문제가 발생하였습니다.");
      }
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      deleteProfileImage();
      refetch();
      toast.success("프로필 사진이 삭제되었습니다.");
    } catch (e) {
      toast.error("프로필 사진 삭제 중 문제가 발생하였습니다.");
    }
  };

  return (
    <Modal onClose={onClose} closeOnOutsideClick={true}>
      <div className="flex flex-col">
        <h1 className="mb-10 text-xl font-bold">프로필 수정</h1>
        <div className="flex flex-col gap-5">
          <div className="flex w-full justify-center">
            <img
              src={userDetails?.imageUrl}
              className="size-28 rounded-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-8">
            <span>프로필 사진</span>
            <div className="flex items-center gap-0">
              <input
                type="file"
                onChange={handleFileChangeAndUpload}
                className="hidden"
                ref={(input) => {
                  if (input) input.style.display = "none";
                }}
                id="fileInput"
              />
              <Button
                variant={"transparent"}
                className="text-neutral-500"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                업로드
              </Button>
              <Button
                variant={"transparent"}
                className="text-red-500 hover:text-red-800"
                onClick={handleProfileImageDelete}
              >
                삭제
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mb-3">사용자 이름</span>
            <div className="flex items-center justify-between">
              <p className="font-bold">{userDetails?.username}</p>
              <Button
                variant={"transparent"}
                className="flex-none text-neutral-500"
                onClick={onUsernameChangeClick}
              >
                변경
              </Button>
            </div>
          </div>
          <Button className="w-full border" variant={"ghost"} onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}
