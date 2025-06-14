import  { createContext, useContext, useState, ReactNode, useCallback } from "react";

type SupabaseErrorContextType = {
  error: string | null;
  setError: (msg: string | null) => void;
};

const SupabaseErrorContext = createContext<SupabaseErrorContextType | undefined>(undefined);

export const SupabaseErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setErrorState] = useState<string | null>(null);

  // useCallback zgodnie z guideline
  const setError = useCallback((msg: string | null) => setErrorState(msg), []);

  return (
    <SupabaseErrorContext.Provider value={{ error, setError }}>
      {children}
    </SupabaseErrorContext.Provider>
  );
};

export const useSupabaseError = () => {
  const ctx = useContext(SupabaseErrorContext);
  if (!ctx) throw new Error("useSupabaseError musi być użyty wewnątrz SupabaseErrorProvider");
  return ctx;
};