// $ Hook handling the logic for logging user out of session
import { useLogout } from "@/utils/aws-signout";
import { Power } from "lucide-react";

type Props = {
  className?: string;
};

const LogoutButton = ({ className }: Props) => {
  const handleLogout = useLogout();

  return (
    <>
      <button
        onClick={handleLogout}
        className={`
        ${className}
        w-full
        px-3
        py-2
        lg:flex
        items-center
        justify-center
        text-white
        cursor-pointer
        rounded-full
        bg-red-400
        tracking-wide
        hover:bg-red-500/90
        hidden
        `}
      >
        Logout
      </button>
      {/* // Mobile Button */}
      <button
        onClick={handleLogout}
        className="lg:hidden flex hover:cursor-pointer text-red-500 hover:text-red-500/90"
      >
        <Power size={24} />
      </button>
    </>
  );
};

export default LogoutButton;
