import useGlobalContext from "@/context/useGlobalContext";
import { FiMenu } from "react-icons/fi";

type Props = {
  className?: string;
};

const NavbarMenuButton = ({ className }: Props) => {
  const { setIsOpen, isOpen, setOpenNotificationSidebar } = useGlobalContext();
  return (
    <div
      className="items-center flex justify-center hover:cursor-pointer text-(--clr-textLight)lg:invisible
      hover:text-gray-700"
    >
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => {
          setOpenNotificationSidebar(false);
          setIsOpen(!isOpen);
        }}
        className={`${className} hover:cursor-pointer `}
      >
        <FiMenu size={24} />
      </button>
    </div>
  );
};

export default NavbarMenuButton;
