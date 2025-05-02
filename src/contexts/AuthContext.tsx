import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { LoadingSpinner, LoadingContainer, LoadingText } from '../components/common/LoadingSpinner';
import { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

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

const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  first_name: supabaseUser.user_metadata.first_name,
  last_name: supabaseUser.user_metadata.last_name
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
          setUser(mapSupabaseUser(session.user));
        }
        
        setError(null);
      } catch (error) {
        const authError = error as AuthError;
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
            setUser(mapSupabaseUser(session.user));
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};