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
        py-3
        flex
        items-center
        gap-4
        text-(--clr-font)
        bg-[rgba(252,18,59,0.2)]
        hover:bg-[#222e44]
        cursor-pointer
        rounded-none
      `}
    >
      <HiLogout size={18} />
      <span className="text-xl">Logout</span>
    </button>
  );
};

export default SidebarLogoutButton;
