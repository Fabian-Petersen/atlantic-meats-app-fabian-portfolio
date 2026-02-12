type Props = {
  className?: string;
  title: string;
  onClick: () => void;
};
import { PlusCircle } from "lucide-react";

export default function AddNewItemButton({ className, title, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} flex items-center justify-between gap-2 h-1/2
      px-3 py-2 bg-primary/90 hover:bg-primary hover:cursor-pointer text-white text-sm font-medium
      rounded-md transition-colors
      `}
    >
      <PlusCircle className="size-5" />
      <span className="hidden md:block">{title}</span>
    </button>
  );
}
