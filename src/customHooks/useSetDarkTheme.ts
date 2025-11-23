// // $ This hook manages the logic to set the theme by toggling between dark and light mode.
import { useEffect } from "react";
import { useGlobalContext } from "@/useGlobalContext";
import type { Theme, T } from "@/useGlobalContext";

const useSetDarkTheme = () => {
  const { theme, isDarkTheme, setIsDarkTheme, setTheme }: T =
    useGlobalContext()!;

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    setTheme(isDarkTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkTheme);
    localStorage.setItem("theme", theme);
  };
  // $ save the theme in local storage and set it to the theme state
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      document.documentElement.classList.add("dark");
      setTheme(localTheme as Theme);
    }
  }, [setTheme]);
  return { toggleDarkTheme };
};

export default useSetDarkTheme;
