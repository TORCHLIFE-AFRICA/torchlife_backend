import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
    constructor(private readonly prismaDB: PrismaService) {}

    // get user by email or id
    async getUser(identifier: string): Promise<User> {
        const whereClause: Prisma.UserWhereInput[] = [];

        if (isUUID(identifier)) {
            whereClause.push({ id: identifier });
        }

        whereClause.push({ email: identifier });
        whereClause.push({ phone_number: identifier });

        const user = await this.prismaDB.user.findFirst({
            where: {
                OR: whereClause,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
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
    async createUser(user: SignUpDto): Promise<Omit<User, 'password'>> {
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
        return result;
    }

    //Update password
    async updatePassword(identifier: string, password: string): Promise<Omit<User, 'password'>> {
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
            return userWithoutPassword;
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    // delete user
    async deleteUser(id: string): Promise<Omit<User, 'password'>> {
        const deletedUser = await this.prismaDB.user.delete({
            where: {
                id: id,
            },
        });
        const { password, ...result } = deletedUser;
        return result;
    }

    // get all users
    async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        const users = await this.prismaDB.user.findMany();
        return users.map((user) => {
            const { password, ...result } = user;
            return result;
        });
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
}
