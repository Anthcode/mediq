import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole, Permission } from '../../types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Komponent do warunkowego renderowania na podstawie uprawnień
 * Nie przekierowuje - po prostu pokazuje/ukrywa content
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
  showFallback = false
}) => {
  const { user, hasAnyRole, hasPermission, isLoading } = usePermissions();
  
  // Debug logs
  console.log('PermissionGate:', {
    roles,
    userRole: user?.role,
    roleType: user?.role ? typeof user.role : 'no user',
    isLoading,
    hasAccess: user ? hasAnyRole(roles) : false,
    user: user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      roleValid: ['administrator', 'doctor', 'moderator', 'user'].includes(user.role)
    } : 'no user'
  });
  
  // Nie renderuj nic podczas ładowania
  if (isLoading) {
    return null;
  }

  // If not authenticated, don't show anything by default
  if (!user) {
    return showFallback ? <>{fallback}</> : null;
  }
  // Check roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    console.log('PermissionGate: Access denied, role mismatch', {
      roles,
      userRole: user?.role,
      roleValid: user ? ['administrator', 'doctor', 'moderator', 'user'].includes(user.role) : false,
      rolesContainsAdministrator: roles.includes('administrator'),
      isUserAdmin: user?.role === 'administrator'
    });
    return showFallback ? <>{fallback}</> : null;
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));
      

    if (!hasRequiredPermissions) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
};
