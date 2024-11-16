import { api } from "../serverAPI";

export const addFriend = async (username: string) => {
  const response = await api.post("/friend", { toUser: username });
  return response.data;
};
