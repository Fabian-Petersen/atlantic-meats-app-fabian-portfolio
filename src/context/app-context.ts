import { createContext } from "react";
import type { AppContextType } from "./app-types";

export const AppContext = createContext<AppContextType | null>(null);
