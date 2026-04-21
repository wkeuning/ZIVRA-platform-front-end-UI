import { getUserRoleFromToken } from "@/services/auth/AuthService";

export const getUserRole = (): string | null => {
  const token = localStorage.getItem("token");
  if (token) {
    return getUserRoleFromToken(token);
  }
  return null;
};
