export type UserRole = 'user' | 'administrator' | 'doctor' | 'moderator';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole; // ← Zmiana z string na UserRole
}

// Dodaj definicje uprawnień
export const ROLE_PERMISSIONS = {
  user: [
    'read:own-profile', 
    'update:own-profile', 
    'read:doctors',
    'create:search-history'
  ],
  doctor: [
    'read:own-profile', 
    'update:own-profile', 
    'read:doctors',
    'update:own-doctor-profile'
  ],
  moderator: [
    'read:own-profile', 
    'update:own-profile', 
    'read:doctors',
    'read:users',
    'moderate:content'
  ],
  administrator: ['*'], // Wszystkie uprawnienia
} as const;

// Helper types
export type Permission = typeof ROLE_PERMISSIONS[UserRole][number];

// Role hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  doctor: 2,
  moderator: 3,
  administrator: 4,
};