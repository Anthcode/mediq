import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { UserRole } from '../../types/auth';
import { supabase } from '../../lib/supabase';

const RoleManagerContainer = styled.div`
  padding: ${theme.spacing(3)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.neutral.light};
  margin-bottom: ${theme.spacing(3)};
`;

const RoleSelector = styled.select`
  padding: ${theme.spacing(1)};
  margin: 0 ${theme.spacing(1)};
  border: 1px solid ${theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.small};
  background-color: ${theme.colors.background.default};
`;

const RoleInfo = styled.div`
  margin-bottom: ${theme.spacing(2)};
  padding: ${theme.spacing(1.5)};
  background-color: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.small};
`;

interface UserRoleManagerProps {
  userId: string;
  currentRole: UserRole;
  userEmail: string;
  onRoleUpdate: (newRole: UserRole) => void;
}

export const UserRoleManager: React.FC<UserRoleManagerProps> = ({
  userId,
  currentRole,
  userEmail,
  onRoleUpdate
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleRoleChange = async () => {
    if (selectedRole === currentRole) return;

    const confirmMessage = `Czy na pewno chcesz zmienić rolę użytkownika ${userEmail} z "${currentRole}" na "${selectedRole}"?`;
    if (!confirm(confirmMessage)) return;

    setIsUpdating(true);
    try {
      // Korzystamy z tabeli user_roles zamiast profiles
      const { error } = await supabase
        .from('user_roles')
        .update({ role: selectedRole })
        .eq('user_id', userId);

      if (error) throw error;

      onRoleUpdate(selectedRole);
      alert(`Rola została pomyślnie zmieniona na: ${selectedRole}`);
    } catch (error) {
      console.error('Błąd zmiany roli:', error);
      alert('Nie udało się zmienić roli. Sprawdź konsolę dla szczegółów.');
      setSelectedRole(currentRole); // Reset do poprzedniej wartości
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'user': return 'Standardowy użytkownik systemu';
      case 'doctor': return 'Lekarz - dostęp do panelu lekarza';
      case 'moderator': return 'Moderator - może zarządzać treściami';
      case 'administrator': return 'Administrator - pełny dostęp do systemu';
      default: return '';
    }
  };

  return (
    <RoleManagerContainer>
      <h4>Zarządzanie rolą użytkownika</h4>
      <RoleInfo>
        <div><strong>Email:</strong> {userEmail}</div>
        <div><strong>Obecna rola:</strong> {currentRole}</div>
        <div><strong>Opis:</strong> {getRoleDescription(currentRole)}</div>
      </RoleInfo>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
        <label>
          Nowa rola:
          <RoleSelector
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            disabled={isUpdating}
          >
            <option value="user">Użytkownik</option>
            <option value="doctor">Lekarz</option>
            <option value="moderator">Moderator</option>
            <option value="administrator">Administrator</option>
          </RoleSelector>
        </label>
        
        <Button
          onClick={handleRoleChange}
          disabled={isUpdating || selectedRole === currentRole}
          $size="small"
          $variant="primary"
        >
          {isUpdating ? 'Zapisywanie...' : 'Zmień rolę'}
        </Button>
      </div>
      
      {selectedRole !== currentRole && (
        <div style={{ 
          marginTop: theme.spacing(1), 
          padding: theme.spacing(1),
          backgroundColor: theme.colors.warning.light,
          borderRadius: theme.borderRadius.small,
          fontSize: '0.875rem'
        }}>
          <strong>Nowa rola:</strong> {getRoleDescription(selectedRole)}
        </div>
      )}
    </RoleManagerContainer>
  );
};
