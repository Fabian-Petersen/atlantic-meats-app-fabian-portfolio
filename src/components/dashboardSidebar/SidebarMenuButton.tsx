import { useGlobalContext } from "@/useGlobalContext";
import { FiMenu } from "react-icons/fi";

type Props = {
  className?: string;
};

const SidebarMenuButton = ({ className }: Props) => {
  const { setIsOpen } = useGlobalContext();
  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`${className} absolute right-3 top-3.5 p-2 rounded-md
        text-gray-800 dark:text-blue-200
        hover:text-gray-700 dark:hover:text-gray-200
        dark:hover:bg-gray-500/40 hover:cursor-pointer`}
    >
      <FiMenu size={20} />
    </button>
  );
};

export default SidebarMenuButton;
