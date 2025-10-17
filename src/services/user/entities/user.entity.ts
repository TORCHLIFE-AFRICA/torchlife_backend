import { USER_ACTIVITIES, USER_ROLES } from '@prisma/client';

export class UserEntity {
    id: string;
    first_name: string;
    last_name: string;
    password: string;
    isverified: boolean;
    email: string;
    phone_number: string;
    role: USER_ROLES | null;
    activities: USER_ACTIVITIES | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;

    constructor(data: {
        id: string;
        first_name: string;
        last_name: string;
        isverified: boolean;
        email: string;
        phone_number: string;
        role?: USER_ROLES | null;
        activities?: USER_ACTIVITIES | null;
        created_at?: Date;
        updated_at?: Date;
        deleted_at?: Date | null;
    }) {
        this.id = data.id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.isverified = data.isverified;
        this.email = data.email;
        this.phone_number = data.phone_number;
        this.role = data.role ?? null;
        this.activities = data.activities ?? null;
        this.created_at = data.created_at ?? new Date();
        this.updated_at = data.updated_at ?? new Date();
        this.deleted_at = data.deleted_at ?? null;
    }
}
