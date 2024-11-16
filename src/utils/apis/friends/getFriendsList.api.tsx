import { UserDetailsType } from "../../../types/types";
import { api } from "../serverAPI";

export interface FriendsListResponseDto {
    friends: UserDetailsType[]
}

export const getFriendsList = async () => {
    const response = await api.get<FriendsListResponseDto>("/users/friends");
    return response.data;
}
