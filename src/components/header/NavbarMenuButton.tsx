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
      className={`${className} text-gray-800 block lg:invisible
        hover:text-gray-700 hover:cursor-pointer`}
    >
      <FiMenu size={20} />
    </button>
  );
};

export default NavbarMenuButton;
