import { createContext } from "react";
import type { T } from "./app-types";

export const AppContext = createContext<T | undefined>(undefined);
