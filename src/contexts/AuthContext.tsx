import { useState, useEffect, ReactNode, useRef } from "react";
import { supabase } from "../lib/supabase";
import { User, UserRole } from "../types/auth";
import {
  LoadingSpinner,
  LoadingContainer,
  LoadingText,
} from "../components/common/LoadingSpinner";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext.context";

// Typ pomocniczy do walidacji roli
const isValidRole = (role: unknown): role is UserRole => {
  const validRoles = ["administrator", "doctor", "moderator", "user"] as const;
  return typeof role === "string" && validRoles.includes(role as UserRole);
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
      .from("user_roles")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .single();

    //console.log("Raw user role data:", userRole);

    if (roleError) {
      console.error("Error fetching role:", roleError);
      throw new Error("Failed to fetch user role");
    }

    if (!userRole?.role) {
      console.error("No role found for user:", supabaseUser.id);
      throw new Error("No role found for user");
    }

    // Sprawdź dokładnie typ roli
    // console.log("Role type check:", {
    //   role: userRole.role,
    //   typeofRole: typeof userRole.role,
    //   validRoles: ["administrator", "doctor", "moderator", "user"],
    //   isValid: ["administrator", "doctor", "moderator", "user"].includes(
    //     userRole.role
    //   ),
    // });

    // Upewnij się, że rola jest poprawna
    if (!isValidRole(userRole.role)) {
      console.error("Invalid role:", userRole.role);
      throw new Error(`Invalid role: ${userRole.role}`);
    }

    // Tworzenie obiektu użytkownika
    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      first_name: supabaseUser.user_metadata?.first_name || "",
      last_name: supabaseUser.user_metadata?.last_name || "",
      role: userRole.role as UserRole,
    };

    // console.log("Mapped user with role:", mappedUser);
    return mappedUser;
  } catch (error) {
    console.error("Error mapping user:", error);
    throw error;
  }
};

// Provider komponent - kompatybilny z Fast Refresh
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRef = useRef<User | null>(null);

  // Synchronizuj ref z state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const mappedUser = await mapSupabaseUser(session.user);

          if (!isValidRole(mappedUser.role)) {
            throw new Error(`Invalid role after mapping: ${mappedUser.role}`);
          }

          setUser(mappedUser);
          setError(null);
        } else if (mounted) {
          setUser(null);
          setError(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : "Unknown error");
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Ignoruj eventy które nie wymagają aktualizacji stanu
      if (event === "INITIAL_SESSION") {
        return;
      }

      console.log("Auth state change:", event, session?.user?.id);

      try {
        // Dla TOKEN_REFRESHED zawsze ignoruj jeśli mamy już użytkownika
        if (event === "TOKEN_REFRESHED") {
          return;
        } // Dla SIGNED_IN sprawdź czy już mamy tego samego użytkownika
        if (event === "SIGNED_IN" && session?.user) {
          const sessionUserId = session.user.id;
          const currentUser = userRef.current;

          // Jeśli już mamy tego samego użytkownika, nie rób nic
          if (currentUser && currentUser.id === sessionUserId) {
            console.log("User already exists, skipping mapping");
            return;
          }

          const mappedUser = await mapSupabaseUser(session.user);

          if (!isValidRole(mappedUser.role)) {
            throw new Error(
              `Invalid role after auth change: ${mappedUser.role}`
            );
          }

          setUser(mappedUser);
          setError(null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setError(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Usuwamy user z dependency array żeby uniknąć pętli

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

// Eksportujemy tylko provider jako domyślny eksport dla Fast Refresh
export default AuthProvider;
