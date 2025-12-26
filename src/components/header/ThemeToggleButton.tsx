// $ This component manages the theme of the website, dark theme or light theme.
// $ To use this the useSetTheme hook must be imported and used in the component to manage the theme state.
// $ The icons for the theme toggle are imported from the component ThemeToggleIcon.

import useSetTheme from "@/customHooks/useSetDarkTheme";
import { useGlobalContext } from "@/useGlobalContext";
import { Moon, Sun } from "lucide-react";
import Button from "@/components/features/Button";
import useScreenSize from "@/customHooks/useScreenSize";

const ThemeToggleButton = () => {
  const { toggleDarkTheme } = useSetTheme();
  const { isDarkTheme } = useGlobalContext()!;
  const isMobile = useScreenSize(740);

  const handleClick = () => {
    toggleDarkTheme();
  };

  return (
    <div className="hover:cursor-pointer border-2 border-yellow-600 flex rounded-full justify-center p-1">
      {isDarkTheme ? (
        <Button
          type="button"
          onClick={handleClick}
          className="text-blue-800 hover:cursor-pointer"
        >
          <Moon size={isMobile ? 18 : 24} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleClick}
          className="text-yellow-100 hover:cursor-pointer"
        >
          <Sun size={isMobile ? 18 : 24} />
        </Button>
      )}
    </div>
  );
};

export default ThemeToggleButton;
