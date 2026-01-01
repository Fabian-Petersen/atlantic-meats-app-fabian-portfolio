// $ This hook manages the logic to set the theme by toggling between dark and light mode.
import { useEffect } from "react";
import { useGlobalContext } from "@/useGlobalContext";

const useSetDarkTheme = () => {
  const { isDarkTheme, setIsDarkTheme, setTheme } = useGlobalContext()!;

  const toggleDarkTheme = () => {
    const newIsDark = !isDarkTheme;

    setIsDarkTheme(newIsDark);
    const newTheme = newIsDark ? "dark" : "light";
    setTheme(newTheme);

    // add or remove dark class explicitly
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);
  };

  // initialize theme from localStorage
  useEffect(() => {
    const localTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (localTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkTheme(false);
      setTheme("light");
    }
  }, [setIsDarkTheme, setTheme]);

  return { toggleDarkTheme };
};

export default useSetDarkTheme;
