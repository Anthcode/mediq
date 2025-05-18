export type UserRole = 'user' | 'administrator' | 'doctor' | 'moderator';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export const PERMISSIONS = {
  READ_OWN_PROFILE: 'read:own-profile',
  UPDATE_OWN_PROFILE: 'update:own-profile',
  READ_DOCTORS: 'read:doctors',
  CREATE_SEARCH_HISTORY: 'create:search-history',
  UPDATE_OWN_DOCTOR_PROFILE: 'update:own-doctor-profile',
  READ_USERS: 'read:users',
  MODERATE_CONTENT: 'moderate:content',
  ALL_PERMISSIONS: '*'
} as const;

// Definicja typu Permission na podstawie dostępnych uprawnień
type PermissionValues = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Permission = PermissionValues;

// Role i ich uprawnienia
export const ROLE_PERMISSIONS = {
  user: [
    PERMISSIONS.READ_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.READ_DOCTORS,
    PERMISSIONS.CREATE_SEARCH_HISTORY
  ],
  doctor: [
    PERMISSIONS.READ_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.READ_DOCTORS,
    PERMISSIONS.UPDATE_OWN_DOCTOR_PROFILE
  ],
  moderator: [
    PERMISSIONS.READ_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.READ_DOCTORS,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.MODERATE_CONTENT
  ],
  administrator: [PERMISSIONS.ALL_PERMISSIONS] // Wszystkie uprawnienia
} as const;

// Role hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  doctor: 2,
  moderator: 3,
  administrator: 4,
};