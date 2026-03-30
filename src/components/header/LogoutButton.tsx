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
        type="button"
        className={`
        ${className}
        w-full
        px-4
        py-2
        lg:flex
        items-center
        justify-center
        text-gray-200
        cursor-pointer
        rounded-full
        bg-red-500
        tracking-wide
        hover:bg-red-400
        hover:shadow
        hidden
        capitalize
        `}
      >
        sign out
      </button>
      {/* // Mobile Button */}
      <button
        aria-label="logout button"
        type="button"
        onClick={handleLogout}
        className="lg:hidden p-2 items-center justify-center rounded-md flex hover:cursor-pointer text-red-600 hover:text-red-500/90"
      >
        <Power size={24} />
      </button>
    </>
  );
};

export default LogoutButton;
