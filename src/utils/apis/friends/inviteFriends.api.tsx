import { api } from "../serverAPI";

export const inviteFriends = async (chatRoomId:number, friends:number[]) => {
    const response = await api.post(`/chatrooms/${chatRoomId}/friends`, {friends: friends});
    return response.data;
}