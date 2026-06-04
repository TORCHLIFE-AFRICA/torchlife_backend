import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { DbUser } from 'src/shared/types/db-user.types';

@Injectable()
export class UserService {
    constructor(private readonly prismaDB: PrismaService) { }

    async getUser(identifier: string): Promise<DbUser> {
        console.log('🔎 Identifier received:', identifier);

        const user = await this.prismaDB.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone_number: identifier },
                ],
            },
        });

        if (!user) {
            const allUsers = await this.prismaDB.user.findMany();
            console.log('📋 All users in DB:', allUsers);
            throw new NotFoundException('User not found');
        }

        return user as unknown as DbUser;
    }


    async verifiedEmail(id: string) {
        await this.prismaDB.user.update({
            where: { id },
            data: {
                isverified: true,
            },
        });
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // create user
    async createUser(user: SignUpDto): Promise<Omit<DbUser, 'password'>> {
        //verify if user already exists
        const hashedPassword = await this.hashPassword(user.password);
        const existing = await this.prismaDB.user.findFirst({
            where: {
                OR: [{ email: user.email }, { phone_number: user.phone_number }],
            },
        });

        if (existing) {
            throw new ConflictException('Email or phone number already exists');
        }

        const newUser = await this.prismaDB.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number || '',
                isverified: false,
            },
        });
        const { password, ...result } = newUser;
        return result as unknown as Omit<DbUser, 'password'>;
    }

    //Update password
    async updatePassword(identifier: string, password: string): Promise<Omit<DbUser, 'password'>> {
        try {
            const hashedPassword = await this.hashPassword(password);
            const user = await this.getUser(identifier);

            const updatedUser = await this.prismaDB.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                },
            });
            const { password: _, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword as unknown as Omit<DbUser, 'password'>;
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    // delete user
    async deleteUser(id: string): Promise<Omit<DbUser, 'password'>> {
        const deletedUser = await this.prismaDB.user.delete({
            where: {
                id: id,
            },
        });
        const { password, ...result } = deletedUser;
        return result as unknown as Omit<DbUser, 'password'>;
    }

    // get all users
    async getAllUsers(): Promise<Array<Omit<DbUser, 'password'>>> {
        const users = await this.prismaDB.user.findMany();
        return users.map((user) => {
            const { password, ...result } = user;
            return result as unknown as Omit<DbUser, 'password'>;
        });
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        await this.prismaDB.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }
}
