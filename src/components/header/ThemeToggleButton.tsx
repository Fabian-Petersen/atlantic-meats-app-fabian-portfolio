// $ This component manages the theme of the website, dark theme or light theme.
// $ To use this the useSetTheme hook must be imported and used in the component to manage the theme state.
// $ The icons for the theme toggle are imported from the component ThemeToggleIcon.

import useSetTheme from "@/customHooks/useSetDarkTheme";
import { useGlobalContext } from "@/useGlobalContext";
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
    <>
      {isDarkTheme ? (
        <Button
          type="button"
          onClick={handleClick}
          className={`${className} text-(--clr-font) hover:cursor-pointer`}
        >
          <Sun size={24} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleClick}
          className={`${className} text-(--clr-font) hover:cursor-pointer`}
        >
          <Moon size={24} />
        </Button>
      )}
    </>
  );
};

export default ThemeToggleButton;
