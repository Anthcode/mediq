import { useAuth } from './useAuth';
import { ROLE_PERMISSIONS, UserRole, ROLE_HIERARCHY, Permission } from '../types/auth';

export const usePermissions = () => {
  const { user, isLoading } = useAuth();

  

  /**
   * Sprawdza czy użytkownik ma konkretną rolę
   */
  const hasRole = (role: UserRole): boolean => {
    const result = user?.role === role;
    return result;
  };

  /**
   * Sprawdza czy użytkownik ma którąkolwiek z podanych ról
   */  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user?.role) {
      console.log('hasAnyRole: No user or role');
      return false;
    }
    
    // Sprawdź czy rola użytkownika jest poprawna
    if (!['administrator', 'doctor', 'moderator', 'user'].includes(user.role)) {
      console.error('hasAnyRole: Invalid user role:', user.role);
      return false;
    }

    const result = roles.includes(user.role);
    
    return result;
  };

  /**
   * Sprawdza czy użytkownik ma uprawnienie
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) {
      console.log('hasPermission: No user or role');
      return false;
    }

    // Sprawdź czy rola użytkownika jest poprawna
    if (!['administrator', 'doctor', 'moderator', 'user'].includes(user.role)) {
      console.error('hasPermission: Invalid user role:', user.role);
      return false;
    }

    const userPermissions: readonly Permission[] = ROLE_PERMISSIONS[user.role];
    const result = userPermissions.includes('*' as Permission) || userPermissions.includes(permission);
    
    
    return result;
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

  const isAdmin = hasRole('administrator');
  const isDoctor = hasRole('doctor');
  const isModerator = hasRole('moderator');
  const isUser = hasRole('user');

  return {
    user,
    isLoading,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasMinimumRole,
    canManageUser,
    isAdmin,
    isDoctor,
    isModerator,
    isUser,
    // Advanced checks
    canManageUsers: isAdmin || isModerator,
    canViewAdminPanel: isAdmin || isModerator,
    canManageDoctors: isAdmin,
    canViewDoctorPanel: isAdmin || isDoctor,
    canModerateContent: isAdmin || isModerator,
  };
};
