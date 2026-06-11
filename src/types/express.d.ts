import { AuthUser } from 'src/shared/types/token-payload.types';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export {};

