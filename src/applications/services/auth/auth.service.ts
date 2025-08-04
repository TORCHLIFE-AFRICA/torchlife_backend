import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DBx, PrismaService } from 'src/infrastructure/prisma/prisma.service';
// import { IAuth } from '../../../auth/auth.interface';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from '../../dtos/auth.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/applications/services/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPayload } from 'src/shared/types/token-payload.types';
import { IAuth } from 'src/domain/interface/auth.interface';

@Injectable()
export class AuthService implements IAuth {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    //signup user
    async signUp(signUpDto: SignUpDto, response: Response): Promise<{ data: Omit<User, 'password' | 'id'> }> {
        //hashing password and setting it to as the new password
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        signUpDto.password = hashedPassword;
        // saving the user in the database
        try {
            const user = await this.userService.createUser(signUpDto);
            // setting the access token and expiresAt, from the userID
            const tokenPayload: TokenPayload = { id: user.id };
            const accessToken = this.jwtService.sign(tokenPayload, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
                expiresIn: `${this.configService.getOrThrow('JWT_EXPIRATION')}ms`,
            });
            const expiresInMs = Number(this.configService.getOrThrow('JWT_EXPIRATION'));
            const expiresAt = new Date(Date.now() + expiresInMs);
            //stores the cookie in the HTTP response
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: expiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });

            //returning the user data without the id
            const { id, ...result } = user;
            return { data: result };
        } catch (error) {
            console.error('Failed to create user', error);
            throw new InternalServerErrorException('User creation failed.');
        }
    }

    //signin user
    async signIn(signInDto: SignInDto, res: Response): Promise<Response> {
        try {
            //verifyinng and fetching the user
            const user = (await this.verifyUser(signInDto)).data;
            //assigning the token payload from the user ID
            const tokenPayload: TokenPayload = { id: user.id };
            //setting the access token and expiresAt, from the userID
            const accessToken = this.jwtService.sign(tokenPayload, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
                expiresIn: `${this.configService.getOrThrow('JWT_EXPIRATION')}ms`,
            });
            //expiration
            const expiresAt = new Date(Date.now() + parseInt(this.configService.getOrThrow('JWT_EXPIRATION')));

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: expiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });

            return res.json({ data: accessToken });
        } catch (error) {
            console.error('Failed to sign in user', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }
    // verify user
    async verifyUser(signInDto: SignInDto): Promise<{ data: User }> {
        const { email, password } = signInDto;

        const user = await this.userService.getUser(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return { data: user };
    }

    requestResetPassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    verifyRequestResetPassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    updateResetPassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    changePassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
}
