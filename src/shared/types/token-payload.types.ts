import { USER_ROLES } from '@prisma/client';

export interface TokenPayload {
    id: string;
    role: USER_ROLES;
}
