// $ Hook handling the logic for logging user out of session
import { useLogout } from "@/utils/aws-signout";
import { LogOutIcon } from "lucide-react";

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
        className={`${className} p-2 lg:flex text-sm items-center justify-center text-(--clr-textLight) cursor-pointer rounded-md tracking-wide bg-red-500/30 border border-red-500 hover:bg-red-500/55 hover:shadow hidden capitalize`}
      >
        logout
      </button>
      {/* // Mobile Button */}
      <div className="md:hidden p-2 flex items-center justify-center rounded-md text-gray-900 hover:cursor-pointer">
        <button
          aria-label="logout button"
          type="button"
          onClick={handleLogout}
          className=" hover:cursor-pointer rounded-full bg-white/30 p-1.5"
        >
          <LogOutIcon size={18} />
        </button>
      </div>
    </>
  );
};

export default LogoutButton;
