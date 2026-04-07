// components/Avatar.tsx
import React, { useEffect } from "react";
import { getInitialsElement } from "@/utils/getInitials";
import { useUserAttributes } from "../../utils/aws-userAttributes";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
import UserDetails from "./UserDetails";
interface AvatarProps {
  imageUrl?: string | null;
  size?: number; // optional, default 40px
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, size = 40 }) => {
  const navigate = useNavigate();
  const { data: userData } = useUserAttributes(); // user from Cognito
  const { setUserId } = useGlobalContext();
  useEffect(() => {
    if (userData?.sub) {
      setUserId(userData.sub);
    }
  }, [userData, setUserId]);

  return (
    <div className="flex gap-1">
      <button
        type="button"
        aria-label="avatar-button"
        onClick={() => navigate("/user-profile")}
        className={`size-${size} flex items-center justify-center rounded-full p-2 text-white font-semibold hover:cursor-pointer`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User avatar"
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          getInitialsElement({
            name: userData?.name ?? "",
            surname: userData?.family_name ?? "",
            className:
              "flex items-center justify-center text-gray-600 dark:text-white font-medium text-md lg:text-[1rem] h-10 w-10 rounded-full bg-menu-btn/40",
          })
        )}
      </button>
      <UserDetails />
    </div>
  );
};

export default Avatar;
