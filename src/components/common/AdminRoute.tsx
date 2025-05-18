import React from 'react';
import { RoleBasedRoute } from './RoleBasedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute 
      allowedRoles={['administrator']}
      unauthorizedMessage="Dostęp tylko dla administratorów. Skontaktuj się z administratorem, jeśli uważasz, że to błąd."
    >
      {children}
    </RoleBasedRoute>
  );
};