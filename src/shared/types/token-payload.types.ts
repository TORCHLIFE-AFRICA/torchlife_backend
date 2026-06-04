import { UserRole } from 'src/domain/enums/user-role.enum';

export interface AuthUser {
    id: string;
    role: UserRole;
}

export type JwtPayload = {
    sub: string;
    role: UserRole;
};
