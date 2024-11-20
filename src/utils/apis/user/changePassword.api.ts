import { api } from "../serverAPI";

interface changePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async ({
  currentPassword,
  newPassword,
}: changePasswordRequestDto) => {
  const response = await api.patch("/users/me/update/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
