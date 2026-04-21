import ProfileIcon from "@/assets/profile.svg";
import { useAuthService } from "@/services/auth/AuthService";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userRoleAtom, userProfileAtom } from "@/states/auth/userAtom";
import { getUserRole } from "@/services/auth/UserService";
import { useEffect, useState } from "react";
import { useProfileService } from "@/services/profile/ProfileService";

export default function Profile() {
    const { logout } = useAuthService();
    const [userProfile] = useAtom(userProfileAtom);
    const { fetchUserProfile } = useProfileService();

    const [role, setRole] = useState("");
    const [userRole] = useAtom(userRoleAtom);

    useEffect(() => {
        if (!userProfile) {
            fetchUserProfile();
        }
    }, [userProfile, fetchUserProfile]);

    useEffect(() => {
        const userRole = getUserRole();
        if (userRole) {
            setRole(userRole);
        }
    }, [userRole]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            <div className="flex items-center mb-6">
                <img src={ProfileIcon} alt="Profile" className="h-20 w-20 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">
                        {userProfile?.firstName} {userProfile?.lastName}
                    </h2>
                    <p className="text-gray-600">{role}</p>
                </div>
            </div>
            <Button 
                onClick={logout} 
                className="w-50 bg-[#4C45FC] text-white p-2 rounded-xl hover:bg-[#3A35D5]"
            >
                Logout
            </Button>
        </div>
    );
}