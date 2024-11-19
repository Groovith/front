import { api } from "../serverAPI";

export const deleteFriend = async (username: string) => {
  const response = await api.delete("/friend", { data: { toUser: username } });
  return response.data;
};
