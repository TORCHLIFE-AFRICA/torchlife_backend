import { UserRole } from 'src/domain/enums/user-role.enum';

const USER_ROLE_VALUES = new Set(Object.values(UserRole));

export function parseUserRole(value: unknown): UserRole {
  if (typeof value !== 'string' || !USER_ROLE_VALUES.has(value as UserRole)) {
    throw new Error(`Invalid role in token: ${String(value)}`);
  }
  return value as UserRole;
}

