import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Używamy osobnego obiektu do logów, aby uniknąć serializacji rzeczywistego użytkownika
  // console.log('useAuth hook:', {
  //   user: context.user ? {
  //     id: context.user.id,
  //     email: context.user.email,
  //     role: context.user.role,
  //     roleType: typeof context.user.role,
  //     validRole: ['administrator', 'doctor', 'moderator', 'user'].includes(context.user.role)
  //   } : 'null',
  //   isLoading: context.isLoading
  // });
  
  return context;
};