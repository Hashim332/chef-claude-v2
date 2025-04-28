import { createContext, useContext } from "react";

export const HomeContext = createContext<string[] | undefined>(undefined);
