type Props = {
  className?: string;
  title: string;
};
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddNewItemButton({ className, title }: Props) {
  const navigate = useNavigate();
  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/create-asset")}
        className={`${className} items-center justify-between gap-2
      px-3 py-2 bg-primary/90 hover:bg-primary hover:cursor-pointer text-white text-sm font-medium
      rounded-md transition-colors w-fit
      `}
      >
        <PlusCircle className="size-5" />
        <span className="hidden md:block">{title}</span>
      </button>
      <button
        aria-label="Create New Asset"
        type="button"
        onClick={() => navigate("/create-asset")}
        className={`${className} md:hidden bg-primary/90 hover:bg-primary hover:cursor-pointer text-white text-sm font-medium
      rounded-md transition-colors w-fit
      `}
      >
        <PlusCircle className="size-5" />
      </button>
    </div>
  );
}
