import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { config } from "@/configs/AppConfig";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userRoleAtom } from "@/states/auth/userAtom";
import { useProfileService } from "@/services/profile/ProfileService";

interface AuthResponse {
  token: string;
}

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

// function to get user role from token
export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const useAuthService = () => {
  const navigate = useNavigate();
  const [, setUserRole] = useAtom(userRoleAtom);
  const { fetchUserProfile } = useProfileService();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(config.apiUrl + config.endpoints.auth.login, {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        const userRole = getUserRoleFromToken(token);
        if (userRole) {
          setUserRole(userRole);
        }
        await fetchUserProfile();
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        throw new Error("Connection issue. Please try again later.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/login");
  };

  return {
    login,
    logout,
  };
};