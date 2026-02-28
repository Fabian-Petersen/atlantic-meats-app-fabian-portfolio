import useGlobalContext from "@/context/useGlobalContext";
import { FiMenu } from "react-icons/fi";

type Props = {
  className?: string;
};

const NavbarMenuButton = ({ className }: Props) => {
  const { setIsOpen, isOpen } = useGlobalContext();
  return (
    <div
      className="p-2 items-center flex justify-center hover:cursor-pointer text-gray-800 lg:invisible
      hover:text-gray-700"
    >
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`${className} bg-menu-btn/40 p-2 rounded-md`}
      >
        <FiMenu size={24} />
      </button>
    </div>
  );
};

export default NavbarMenuButton;
