// components/PasswordToggle.tsx
import { Eye, EyeOff } from "lucide-react";

type Props = {
  visible: boolean;
  onToggle: () => void;
};

const PasswordToggle = ({ visible, onToggle }: Props) => {
  console.log("visible:", visible);
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:cursor-pointer"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
};

export default PasswordToggle;
