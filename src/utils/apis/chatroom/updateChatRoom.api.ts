import {
  api,
  ChatRoomPlayerPermissionType,
  ChatRoomPrivacyType,
} from "../serverAPI";

interface UpdateChatRoomRequestDto {
  name: string;
  privacy: ChatRoomPrivacyType;
  permission: ChatRoomPlayerPermissionType;
}

export const updateChatRoom = async (
  chatRoomId: string | number,
  dto: UpdateChatRoomRequestDto,
  file: File | null,
) => {
  console.log(dto);
  const formData = new FormData();
  formData.append(
    "dto",
    new Blob([JSON.stringify(dto)], { type: "application/json" }),
  );
  if (file) formData.append("file", file);
  const response = await api.put(`/chatrooms/${chatRoomId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
