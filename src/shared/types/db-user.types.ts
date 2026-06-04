import { UserRole } from 'src/domain/enums/user-role.enum';

export interface DbUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  isverified: boolean;
  role: UserRole | null;
  activities?: 'DONOR' | 'RECEIVER' | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  refreshToken?: string | null;
}
