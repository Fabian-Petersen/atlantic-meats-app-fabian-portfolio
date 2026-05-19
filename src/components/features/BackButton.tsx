import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to: string;
  label?: string;
}

export default function BackButton({ to, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={cn(
        "group inline-flex items-center gap-2 text-md font-medium text-gray-700",
        "transition-all duration-200 hover:text-gray-900 hover:cursor-pointer",
        "dark:text-(--clr-textDark)",
      )}
    >
      <span className="transition-all duration-200 group-hover:-translate-x-0.5">
        <ChevronLeft />
      </span>
      {label}
    </button>
  );
}
