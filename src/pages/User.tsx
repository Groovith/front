import { EllipsisVertical, UserPlus } from "lucide-react";
import { Button } from "../components/Button";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  checkUsername,
  getUserDetailsByUsername,
  uploadProfileImage,
} from "../utils/apis/serverAPI";
import { UserDetailsType } from "../types/types";
import { useUser } from "../hooks/useUser";
import Loading from "./Loading";
import DropdownButton from "../components/DropdownButton";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../components/Modal";
import { ResponseCode } from "../types/enums";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export default function User() {
  const { getUserId } = useUser();
  const { username } = useParams();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState<
    string | null
  >(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  // username으로 프로필 검색 -> 없으면 없는 유저 화면
  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    refetch,
  } = useQuery<UserDetailsType>({
    queryKey: ["userDetails", username],
    queryFn: () => getUserDetailsByUsername(username as string),
    enabled: !!username,
  });

  // 사용자 이름 규칙 확인 함수
  const validateUsername = (username: string): string | null => {
    const usernameRegex = /^(?!.*[_.]{2})[a-z0-9._]{2,30}$/;
    if (
      !usernameRegex.test(username) ||
      username.startsWith("_") ||
      username.startsWith(".") ||
      username.endsWith("_") ||
      username.endsWith(".")
    ) {
      setUsernameValid(false);
      return "사용자 이름은 2자 이상, 30자 이하의 영문 소문자, 숫자, 밑줄, 마침표만 허용하며, 시작과 끝에 밑줄이나 마침표를 사용할 수 없습니다.";
    }
    return null;
  };

  // 사용자 이름 사용 가능 여부 체크
  const handleCheckUsername = async () => {
    const usernameErrorMessage = validateUsername(newUsername);
    setUsernameCheckMessage(usernameErrorMessage);

    if (!usernameErrorMessage) {
      try {
        const response = await checkUsername({ username: newUsername });
        if (response.code === ResponseCode.SUCCESS) {
          setUsernameCheckMessage("✓ 사용 가능한 사용자 이름입니다.");
          setUsernameValid(true);
        }
      } catch (e: any) {
        if (e.response.data.code === ResponseCode.DUPLICATE_ID) {
          setUsernameCheckMessage("✗ 이미 사용 중인 사용자 이름입니다.");
          setUsernameValid(false);
        } else {
          setUsernameCheckMessage("사용자 이름 확인 중 오류가 발생했습니다.");
          setUsernameValid(false);
        }
      }
    }

    if (!newUsername) {
      setUsernameCheckMessage(null); // 사용자 이름 입력 필드가 비어 있을 경우 메시지 초기화
      setUsernameValid(null);
    }
  };

  const handleChangeUsername = async () => {};

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
        toast.success("프로필 이미지가 변경되었습니다.");
      } catch (e) {
        console.error(e);
        toast.error("프로필 이미지 업로드 중 문제가 발생하였습니다.");
      }
    }
  };

  if (isUserDetailsLoading) {
    return <Loading />;
  }

  // 유저네임이 현재 로그인한 유저네임과 같은지 확인 -> 내 프로필 화면 | 타 유저 프로필 화면 결정

  return (
    <div className="flex h-full w-full justify-center px-10 text-neutral-900">
      <div className="flex w-full max-w-screen-md flex-col gap-10 py-20">
        <div className="flex items-center gap-8">
          <img
            src={userDetails?.imageUrl}
            className="size-28 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2 py-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-neutral-900">
                {userDetails?.username}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-5">
          {userDetails && userDetails.id === getUserId() ? (
            <>
              <Button
                className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200"
                onClick={() => setProfileModalOpen(true)}
              >
                프로필 수정
              </Button>
              {profileModalOpen && (
                <Modal
                  onClose={() => setProfileModalOpen(false)}
                  closeOnOutsideClick={true}
                >
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
                            onClick={() =>
                              document.getElementById("fileInput")?.click()
                            }
                          >
                            업로드
                          </Button>
                          <Button
                            variant={"transparent"}
                            className="text-red-500 hover:text-red-800"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="mb-3">사용자 이름</span>
                        <div className="flex items-center justify-between">
                          {/* <input
                            className="mr-2 w-full rounded-lg border border-neutral-400 p-3"
                            placeholder={userDetails.username}
                          /> */}
                          <p className="font-bold">{userDetails.username}</p>
                          <Button
                            variant={"transparent"}
                            className="flex-none text-neutral-500"
                            onClick={() => {
                              setProfileModalOpen(false);
                              setUsernameModalOpen(true);
                            }}
                          >
                            변경
                          </Button>
                        </div>
                      </div>
                      <Button
                        className="w-full border"
                        variant={"ghost"}
                        onClick={() => setProfileModalOpen(false)}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}
              {usernameModalOpen && (
                <Modal
                  onClose={() => {
                    setUsernameModalOpen(false);
                    setProfileModalOpen(true);
                  }}
                  closeOnOutsideClick={true}
                >
                  <div className="mb-3 flex w-[300px] flex-col gap-5">
                    <h1 className="text-xl font-bold">사용자 이름 변경</h1>
                    <label htmlFor="username">사용자 이름</label>
                    <input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder={username}
                      className="h-8 w-full rounded-lg border px-3 py-5"
                      onBlur={handleCheckUsername}
                    />
                    {usernameCheckMessage && (
                      <p
                        className={`mb-6 text-sm ${usernameValid ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameCheckMessage}
                      </p>
                    )}
                    <div className="flex justify-between gap-3">
                      <Button
                        variant={"ghost"}
                        className="w-full border"
                        onClick={() => {
                          setUsernameModalOpen(false);
                          setProfileModalOpen(true);
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        className="w-full"
                        disabled={!usernameValid}
                        onClick={handleChangeUsername}
                      >
                        변경하기
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}
            </>
          ) : (
            <>
              <Button className="w-full">친구 추가</Button>
              <Button className="w-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-200">
                채팅에 초대
              </Button>
              <DropdownButton
                items={[
                  { label: "채팅방에 초대", action: () => {}, Icon: UserPlus },
                ]}
              >
                <Button variant={"transparent"}>
                  <EllipsisVertical />
                </Button>
              </DropdownButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
