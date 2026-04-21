import axios from "axios";
import { config } from "@/configs/AppConfig";
import { userProfileAtom } from "@/states/auth/userAtom";
import { useAtom } from "jotai";

export const useProfileService = () => {
    const [, setUserProfile] = useAtom(userProfileAtom);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return null;

            const response = await axios.get(`${config.apiUrl}${config.endpoints.user.getProfile}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                const profile = {
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                };
                setUserProfile(profile);
                return profile;
            }
            return null;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            return null;
        }
    };

    return {
        fetchUserProfile,
    };
};