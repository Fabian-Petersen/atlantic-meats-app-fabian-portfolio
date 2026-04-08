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
        className={`${className} px-4 py-2 lg:flex text-sm items-center justify-center text-(--clr-textLight) cursor-pointer rounded-md tracking-wide bg-red-500/30 border border-red-500 hover:bg-red-500 hover:shadow hidden capitalize`}
      >
        logout
      </button>
      {/* // Mobile Button */}
      <button
        aria-label="logout button"
        type="button"
        onClick={handleLogout}
        className="flex justify-center items-center lg:hidden hover:cursor-pointer rounded-full bg-white/30 p-1.5 text-red-500"
      >
        <Power size={18} />
      </button>
    </>
  );
};

export default LogoutButton;
