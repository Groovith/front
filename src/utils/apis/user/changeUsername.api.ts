import { api } from "../serverAPI";

export const changeUsername = async (username: string) => {
  const response = await api.patch("/users/me/update/username", { username });
  return response.data;
};
