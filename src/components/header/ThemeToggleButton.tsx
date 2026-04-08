// $ This component manages the theme of the website, dark theme or light theme.
// $ To use this the useSetTheme hook must be imported and used in the component to manage the theme state.
// $ The icons for the theme toggle are imported from the component ThemeToggleIcon.

import useSetTheme from "@/customHooks/useSetDarkTheme";
import useGlobalContext from "@/context/useGlobalContext";
import { Moon, Sun } from "lucide-react";
import Button from "@/components/features/Button";

type Props = {
  className?: string;
};

const ThemeToggleButton = ({ className }: Props) => {
  const { toggleDarkTheme } = useSetTheme();
  const { isDarkTheme } = useGlobalContext()!;

  const handleClick = () => {
    toggleDarkTheme();
  };

  return (
    <div className="p-2 flex items-center justify-center rounded-md text-gray-900 hover:cursor-pointer">
      {isDarkTheme ? (
        <Button
          type="button"
          onClick={handleClick}
          className={`${className} hover:cursor-pointer rounded-full bg-white/30 p-1.5`}
        >
          <Sun size={18} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleClick}
          className={`${className} hover:cursor-pointer rounded-full bg-white/30 p-1.5`}
        >
          <Moon size={18} />
        </Button>
      )}
    </div>
  );
};

export default ThemeToggleButton;
