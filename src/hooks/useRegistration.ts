import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UseRegistrationResult {
  register: (data: RegistrationData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  registeredEmail: string;
  resetState: () => void;
}

export const useRegistration = (): UseRegistrationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user && !authData.user.email_confirmed_at) {
        setRegisteredEmail(data.email);
        setIsSuccess(true);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setIsSuccess(false);
    setRegisteredEmail('');
  };

  return {
    register,
    isLoading,
    error,
    isSuccess,
    registeredEmail,
    resetState
  };
};