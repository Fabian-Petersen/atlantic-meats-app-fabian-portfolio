import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to: string;
  label?: string;
  iconStyles?: string;
  parentStyles?: string;
}

export default function BackButton({
  to,
  label = "Back",
  iconStyles,
  parentStyles,
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={cn(
        "group inline-flex items-center gap-2 text-md font-medium text-gray-500",
        "transition-all duration-200 hover:text-gray-900 hover:cursor-pointer",
        "dark:text-(--clr-textDark)",
        parentStyles,
      )}
    >
      <span className="transition-all duration-200 group-hover:-translate-x-0.5">
        <ArrowLeft className={iconStyles} />
      </span>
      {label}
    </button>
  );
}
