// components/Avatar.tsx
import React, { useEffect } from "react";
import { getInitialsElement } from "@/utils/getInitials";
import { useUserAttributes } from "../../utils/aws-userAttributes";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/context/useGlobalContext";
// import UserDetails from "./UserDetails";
type AvatarProps = {
  imageUrl?: string | null;
  size?: number; // optional, default 40px
  name?: string | null;
  isFullName?: boolean;
};

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  size = 40,
  name,
  isFullName = false,
}) => {
  const navigate = useNavigate();
  const { data: userData } = useUserAttributes(); // user from Cognito
  const { setUserId } = useGlobalContext();
  useEffect(() => {
    if (userData?.sub) {
      setUserId(userData.sub);
    }
  }, [userData, setUserId]);

  const initials = (name || userData?.name || "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex gap-1">
      {isFullName ? (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-md lg:text-[1rem] font-sans font-semibold text-blue-700 p-1.5 dark:text-blue-300 shrink-0 select-none">
          {initials}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Avatar;
