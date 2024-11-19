import {
  api,
  ChatRoomPlayerPermissionType,
  ChatRoomPrivacyType,
} from "../serverAPI";

interface UpdateChatRoomRequestDto {
  name: string;
  status: ChatRoomPrivacyType;
  permission: ChatRoomPlayerPermissionType;
}

export const updateChatRoom = async (
  chatRoomId: string | number,
  { name, status, permission }: UpdateChatRoomRequestDto,
) => {
  const response = await api.put(`/chatrooms/${chatRoomId}`, {
    name,
    status,
    permission,
  });
  return response.data;
};
