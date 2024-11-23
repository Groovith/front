import { api } from "../serverAPI";

export const deleteAccount = async (password: string) => {
  const response = await api.delete("/users/me", { data: { password } });
  return response.data;
};
