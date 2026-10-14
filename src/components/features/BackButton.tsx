import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

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
        sharedStyles.btnBack,
        parentStyles,
      )}
    >
      <ArrowLeft className={cn(sharedStyles.btnBackIcon, iconStyles)} />
      {label}
    </button>
  );
}
