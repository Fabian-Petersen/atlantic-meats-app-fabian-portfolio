// components/Avatar.tsx
import React, { useEffect } from "react";
import { getInitialsElement } from "@/utils/getInitials";
import { useUserAttributes } from "../../utils/aws-userAttributes";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
// import UserDetails from "./UserDetails";
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
        onClick={() => navigate("/users/profile")}
        className={`size-${size} flex items-center justify-center rounded-full p-1.5 text-white font-semibold hover:cursor-pointer`}
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
              "flex items-center justify-center font-sans font-semibold text-(--clr-textLight) font-medium text-md lg:text-[1rem] h-8 w-8 rounded-full bg-white/30",
          })
        )}
      </button>
    </div>
  );
};

export default Avatar;
