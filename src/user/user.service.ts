import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaDB: PrismaService) {}

    // get user by email or id
    async getUser(identifier: string): Promise<User> {
        const user = await this.prismaDB.user.findFirst({
            where: {
                OR: [{ email: identifier }, { id: identifier }],
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // create user
    async createUser(user: SignUpDto): Promise<Omit<User, 'password'>> {
        const existing = await this.prismaDB.user.findUnique({
            where: {
                email: user.email,
            },
        });
        if (existing) {
            throw new ConflictException('username already exists');
        }

        const newUser = await this.prismaDB.user.create({
            data: { ...user, isverified: false },
        });
        const { password, ...result } = newUser;
        return result;
    }

    //Update password
    async updatePassword(identifier: string, password: string): Promise<Omit<User, 'password'>> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
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
}
