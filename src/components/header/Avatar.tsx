// components/Avatar.tsx
import React from "react";
import { getInitialsElement } from "@/utils/getInitials";
import { useUserAttributes } from "../../utils/aws-userAttributes";
import { useNavigate } from "react-router-dom";

interface AvatarProps {
  imageUrl?: string | null;
  size?: number; // optional, default 40px
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, size = 40 }) => {
  const { data: user } = useUserAttributes();
  const navigate = useNavigate();
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
            name: user?.name ?? "",
            surname: user?.family_name ?? "",
            className:
              "flex items-center justify-center text-gray-600 dark:text-white font-medium text-md lg:text-[1rem] h-12 w-12 rounded-full bg-menu-btn/40 text-gray-600",
          })
        )}
      </button>
      {/* <div className="flex flex-col justify-end">
        <span className="capitalize text-xs">{user?.name ?? ""}</span>
        <span className="capitalize text-xs">{user?.group ?? "admin"}</span>
      </div> */}
    </div>
  );
};

export default Avatar;
