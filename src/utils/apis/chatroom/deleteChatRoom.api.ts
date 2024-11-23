import { api } from "../serverAPI"

export const deleteChatRoom = async (chatRoomId: number | string) => {
    const response = await api.delete(`/chatrooms/${chatRoomId}`);
    return response.data;
}