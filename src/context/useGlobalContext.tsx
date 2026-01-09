import { useContext } from "react";
import { AppContext } from "./app-context";

// $ Step 3: Export the custom hook to be used in other components
const useGlobalContext = () => {
  const context = useContext(AppContext);

  // $ Throw an error if the hook is used outside of the ThemeContextProvider or does not exist
  if (!context) {
    throw new Error("useGlobalContext must be used within the AppProvider");
  }
  // $ Return the context so it can be used in the components
  return context;
};

export default useGlobalContext;
