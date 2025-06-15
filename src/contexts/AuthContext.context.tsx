import { createContext } from "react";
import { User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  error: string | null;
}

// Tworzymy kontekst w osobnym pliku dla Fast Refresh
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
