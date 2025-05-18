import { useAuth } from './useAuth';
import { ROLE_PERMISSIONS, UserRole, ROLE_HIERARCHY } from '../types/auth';

export const usePermissions = () => {
  const { user, isLoading } = useAuth();

  /**
   * Sprawdza czy użytkownik ma konkretną rolę
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  /**
   * Sprawdza czy użytkownik ma uprawnienie
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions: readonly string[] = ROLE_PERMISSIONS[user.role];
    return userPermissions.includes('*') || 
           userPermissions.includes(permission);
  };

  /**
   * Sprawdza czy użytkownik ma którąkolwiek z podanych ról
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  /**
   * Sprawdza czy użytkownik ma rolę o minimalnym poziomie hierarchii
   */
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!user) return false;
    
    const userLevel = ROLE_HIERARCHY[user.role];
    const minimumLevel = ROLE_HIERARCHY[minimumRole];
    
    return userLevel >= minimumLevel;
  };

  /**
   * Sprawdza czy użytkownik może zarządzać innym użytkownikiem
   */
  const canManageUser = (targetUser: { role: UserRole }): boolean => {
    if (!user) return false;
    if (user.role === 'administrator') return true;
    
    const userLevel = ROLE_HIERARCHY[user.role];
    const targetLevel = ROLE_HIERARCHY[targetUser.role];
    
    return userLevel > targetLevel;
  };

  // Convenience properties
  const isAdmin = hasRole('administrator');
  const isDoctor = hasRole('doctor');
  const isModerator = hasRole('moderator');
  const isUser = hasRole('user');

  return {
    user,
    isLoading,
    // Methods
    hasRole,
    hasPermission,
    hasAnyRole,
    hasMinimumRole,
    canManageUser,
    // Convenience flags
    isAdmin,
    isDoctor,
    isModerator,
    isUser,
    // Advanced checks
    canViewAdminPanel: hasAnyRole(['administrator', 'moderator']),
    canManageDoctors: hasRole('administrator'),
    canViewDoctorPanel: hasAnyRole(['administrator', 'doctor']),
    canModerateContent: hasAnyRole(['administrator', 'moderator']),
  };
};
