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

// Typ pomocniczy do walidacji roli
const isValidRole = (role: unknown): role is UserRole => {
  const validRoles = ['administrator', 'doctor', 'moderator', 'user'] as const;
  return typeof role === 'string' && validRoles.includes(role as UserRole);
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Mapuje użytkownika z Supabase na obiekt User używany w aplikacji
 */
const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Pobierz rolę użytkownika z dedykowanej tabeli user_roles
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .single();

    console.log('Raw user role data:', userRole);

    if (roleError) {
      console.error('Error fetching role:', roleError);
      throw new Error('Failed to fetch user role');
    }

    if (!userRole?.role) {
      console.error('No role found for user:', supabaseUser.id);
      throw new Error('No role found for user');
    }

    // Sprawdź dokładnie typ roli
    console.log('Role type check:', {
      role: userRole.role,
      typeofRole: typeof userRole.role,
      validRoles: ['administrator', 'doctor', 'moderator', 'user'],
      isValid: ['administrator', 'doctor', 'moderator', 'user'].includes(userRole.role)
    });

    // Upewnij się, że rola jest poprawna
    if (!isValidRole(userRole.role)) {
      console.error('Invalid role:', userRole.role);
      throw new Error(`Invalid role: ${userRole.role}`);
    }

    // Tworzenie obiektu użytkownika
    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      first_name: supabaseUser.user_metadata?.first_name || '',
      last_name: supabaseUser.user_metadata?.last_name || '',
      role: userRole.role as UserRole
    };

    console.log('Mapped user with role:', mappedUser);
    return mappedUser;
  } catch (error) {
    console.error('Error mapping user:', error);
    throw error;
  }
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const mappedUser = await mapSupabaseUser(session.user);
          console.log('Initial auth state:', mappedUser);
          
          // Dodatkowa walidacja przed ustawieniem stanu
          if (!isValidRole(mappedUser.role)) {
            throw new Error(`Invalid role after mapping: ${mappedUser.role}`);
          }
          
          setUser(mappedUser);
          setError(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
          // Nie ustawiamy domyślnej roli, tylko null
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;

        try {
          setIsLoading(true);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              try {                const mappedUser = await mapSupabaseUser(session.user);
                console.log('User before setState:', {
                  mappedUser,
                  role: mappedUser.role,
                  typeofRole: typeof mappedUser.role,
                  roleValid: isValidRole(mappedUser.role),
                  roleValue: JSON.stringify(mappedUser.role)
                });
                
                if (!isValidRole(mappedUser.role)) {
                  throw new Error(`Invalid role after auth change: ${mappedUser.role}`);
                }
                
                // Kolejne dodatkowe zabezpieczenie - wymuszenie prawidłowego typu
                const userWithCorrectRole: User = {
                  ...mappedUser,
                  role: mappedUser.role as UserRole
                };

                // Ostateczna walidacja przed zapisaniem
                if (userWithCorrectRole.role !== 'administrator' && 
                    userWithCorrectRole.role !== 'doctor' && 
                    userWithCorrectRole.role !== 'moderator' && 
                    userWithCorrectRole.role !== 'user') {
                  throw new Error(`Role validation failed: ${userWithCorrectRole.role}`);  
                }

                setUser(userWithCorrectRole);
                setError(null);
              } catch (error) {
                console.error('Error mapping user after auth change:', error);
                throw error;
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setError(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setError(error instanceof Error ? error.message : 'Unknown error');
          setUser(null);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer $fullpage>
        <LoadingSpinner size="large" />
        <LoadingText>Ładowanie informacji o użytkowniku...</LoadingText>
      </LoadingContainer>
    );
  }

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

export { AuthContext, AuthProvider };
export type { AuthContextType };