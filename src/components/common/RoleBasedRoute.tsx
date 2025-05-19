import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole, Permission } from '../../types/auth';
import { LoadingSpinner } from './LoadingSpinner';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  permissions?: Permission[];
  requireAll?: boolean;
  fallbackPath?: string;
  unauthorizedMessage?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  permissions = [],
  requireAll = false,
  fallbackPath = '/',
  unauthorizedMessage
}) => {
  const { user, isLoading, hasAnyRole, hasPermission } = usePermissions();
  const location = useLocation();
  
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner $fullpage />;
  }
  
  // Not authenticated
  if (!user) {
    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location, message: 'Musisz być zalogowany aby uzyskać dostęp' }} 
    />;
  }
    // Check roles if provided
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {

    
    return <Navigate 
      to={fallbackPath} 
      replace 
      state={{ 
        message: unauthorizedMessage || 'Nie masz uprawnień do tej sekcji' 
      }} 
    />;
  }
    // Check permissions if provided
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));
    
    if (!hasRequiredPermissions) {
      
      return <Navigate 
        to={fallbackPath} 
        replace 
        state={{ 
          message: unauthorizedMessage || 'Nie masz wymaganych uprawnień' 
        }} 
      />;
    }
  }
    console.log('RoleBasedRoute: Access granted', {
    allowedRoles,
    userRole: user?.role,
    path: location.pathname
  });
  
  return <>{children}</>;
};

// Skróty dla często używanych ról
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute 
    allowedRoles={['administrator']} 
    unauthorizedMessage="Tylko administratorzy mają dostęp do tej sekcji"
  >
    {children}
  </RoleBasedRoute>
);

export const DoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute 
    allowedRoles={['doctor', 'administrator']} 
    unauthorizedMessage="Sekcja dostępna tylko dla lekarzy"
  >
    {children}
  </RoleBasedRoute>
);

export const ModeratorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute 
    allowedRoles={['moderator', 'administrator']} 
    unauthorizedMessage="Sekcja dostępna tylko dla moderatorów i administratorów"
  >
    {children}
  </RoleBasedRoute>
);
