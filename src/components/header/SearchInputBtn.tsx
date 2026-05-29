import { Search } from "lucide-react";
import Button from "@/components/features/Button";
import useGlobalContext from "@/context/useGlobalContext";

type SearchInputBtnProps = {
  className?: string;
};

export function SearchInputBtn({ className = "" }: SearchInputBtnProps) {
  const { setOpenSearchInput } = useGlobalContext();

  const handleOnClick = () => {
    setOpenSearchInput(true);
  };
  return (
    <div className="p-2 flex items-center justify-center text-gray-900 hover:cursor-pointer relative">
      {/* Icon button (always visible) */}
      <Button
        type="button"
        aria-label="search button"
        onClick={handleOnClick}
        className={`${className} hover:cursor-pointer rounded-full bg-white/30 p-1.5`}
      >
        <Search size={18} />
      </Button>
    </div>
  );
}
