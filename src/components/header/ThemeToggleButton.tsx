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
    <div className="hover:cursor-pointer">
      {isDarkTheme ? (
        <Button
          type="button"
          onClick={handleClick}
          className="dark:text-white text-white"
        >
          <Moon size={isMobile ? 20 : 24} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleClick}
          className="dark:text-white text-white"
        >
          <Sun size={isMobile ? 20 : 24} />
        </Button>
      )}
    </div>
  );
};

export default ThemeToggleButton;
