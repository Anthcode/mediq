import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types/auth';
import { LoadingSpinner, LoadingContainer, LoadingText } from '../components/common/LoadingSpinner';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Bez użycia tabeli profiles - tylko dane z auth.users
    // To rozwiązanie tymczasowe, które pozwala ominąć problem rekursji
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      first_name: supabaseUser.user_metadata?.first_name || '',
      last_name: supabaseUser.user_metadata?.last_name || '',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'user'
    };
  } catch (error) {
    console.error('Error mapping user:', error);
    // Fallback to default user
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      first_name: supabaseUser.user_metadata?.first_name || '',
      last_name: supabaseUser.user_metadata?.last_name || '',
      role: 'user' // Default role
    };
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Inicjalizacja sesji
    const initializeAuth = async () => {
      try {
        // Najpierw pobierz aktualną sesję
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const mappedUser = await mapSupabaseUser(session.user);
          setUser(mappedUser);
        }
        
        setError(null);
      } catch (error) {
        const authError = error as Error;
        console.error('Błąd inicjalizacji auth:', authError);
        setError(authError.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Wykonaj inicjalizację
    initializeAuth();

    // Nasłuchuj zmian w sesji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const mappedUser = await mapSupabaseUser(session.user);
            setUser(mappedUser);
            setError(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        }
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Renderowanie podczas ładowania
  if (isLoading) {
    return (
      <LoadingContainer $fullpage>
        <LoadingSpinner size="large" />
        <LoadingText>Ładowanie informacji o użytkowniku...</LoadingText>
      </LoadingContainer>
    );
  }

  // Renderowanie w przypadku błędu
  if (error) {
    return (
      <LoadingContainer $fullpage>
        <LoadingText>Wystąpił błąd: {error}</LoadingText>
      </LoadingContainer>
    );
  }
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Eksport komponentu w sposób zgodny z Fast Refresh
export { AuthContext };
export type { AuthContextType };