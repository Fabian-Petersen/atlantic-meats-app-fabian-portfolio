import { useGlobalContext } from "@/useGlobalContext";
import { FiMenu } from "react-icons/fi";

type Props = {
  className?: string;
};

const NavbarMenuButton = ({ className }: Props) => {
  const { setIsOpen, isOpen } = useGlobalContext();
  return (
    <button
      onClick={() => {
        // console.log(`menu button clicked:${isOpen}`);
        setIsOpen(!isOpen);
      }}
      className={`${className} bg-menu-btn/40 p-2 items-center justify-center rounded-md flex hover:cursor-pointer text-gray-800 lg:invisible
        hover:text-gray-700`}
    >
      <FiMenu size={20} />
    </button>
  );
};

export default NavbarMenuButton;
