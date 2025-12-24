"use client";
// $ Hook handling the logic for logging user out of session
import { useLogout } from "@/utils/aws-signout";

// $ Icons
import { HiLogout } from "react-icons/hi"; // or react-icons/fi, depending on preference

type Props = {
  className?: string;
};

const SidebarLogoutButton = ({ className }: Props) => {
  const handleLogout = useLogout();

  return (
    <button
      onClick={handleLogout}
      className={`
      ${className}
        w-full
        px-4
        py-6
        flex
        items-center
        gap-4
        bg-[rgba(29,39,57,0.1)]
        text-red-500
        hover:bg-[#222e44]
        hover:text-red-600
        cursor-pointer
        rounded-none
        dark:bg-[#1d2739]
      `}
    >
      <HiLogout size={18} />
      <span className="text-[1.1rem]">Logout</span>
    </button>
  );
};

export default SidebarLogoutButton;
