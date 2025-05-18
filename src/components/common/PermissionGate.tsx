import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole } from '../../types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
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
  const { user, hasAnyRole, hasPermission } = usePermissions();

  // If not authenticated, don't show anything by default
  if (!user) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
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
