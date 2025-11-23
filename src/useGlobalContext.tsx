// use the react context hook to manage the state of navOpen (true or false) and setNavOpen to change the state
import React from "react";
import { createContext, useContext, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

// $ Step 0: Define the types and specify the navOpen type and set it to false initially'

export type Theme = "light" | "dark";

export type T = {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  isDarkTheme: boolean;
  setIsDarkTheme: Dispatch<SetStateAction<boolean>>;
  projectType: string;
  setProjectType: Dispatch<SetStateAction<string>>;
};

// const initialState: T = {
//   navOpen: false,
//   setNavOpen: () => {},
//   theme: "light",
//   setTheme: () => {},
//   isDarkTheme: false,
//   setIsDarkTheme: () => {},
//   projectType: "all",
//   setProjectType: () => {},
// };

// $ Step 1: Create the context
// % The ThemeContext type takes in the ThemeContext type or null
export const AppContext = createContext<T | undefined>(undefined);

// $ Step 2: Create the provider for the context
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // $ Step 3: Create the state and set the initial state value

  // ? The navOpen state toggles the navbar on and off on mobile devices
  const [navOpen, setNavOpen] = useState<boolean>(false);

  // ? The theme "light | dark" toggles the theme in the localStorage to set the value either light and dark in the 'useSetDarkTheme' hook.
  const [theme, setTheme] = useState<Theme>("light");

  // ? The isDarktheme manages toggles the theme between light and dark by setting the theme to the opposite of the current theme.
  // ? The isDarkTheme is used to set the theme in the 'useSetDarkTheme' hook.
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const [projectType, setProjectType] = useState<string>("all");
  // $ State to filter the projects by projectType to display the different projects in the gallery component.

  return (
    <AppContext.Provider
      value={{
        navOpen,
        setNavOpen,
        theme,
        setTheme,
        isDarkTheme,
        setIsDarkTheme,
        projectType,
        setProjectType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// $ Step 3: Export the custom hook to be used in other components
export const useGlobalContext = () => {
  const context = useContext(AppContext);

  // $ Throw an error if the hook is used outside of the ThemeContextProvider or does not exist
  if (!context) {
    throw new Error("useAppContext must be used within the AppContextProvider");
  }
  // $ Return the context so it can be used in the components
  return context;
};

export default AppProvider;
