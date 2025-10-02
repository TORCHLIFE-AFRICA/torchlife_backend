import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
// import { IAuth } from '../domain/interface/auth.interface';
import { EmailTransportService } from '../email-transport/email-transport.service';
import { TokenService } from './token/token.service';
import { TokenPayload } from 'src/shared/types/token-payload.types';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly emailTransportService: EmailTransportService,
        private readonly tokenService: TokenService,
    ) {}

    //signup user
    async signUp(signUpDto: SignUpDto, response: Response): Promise<{ data: Omit<User, 'password' | 'id'> }> {
        //hashing password and setting it to as the new password
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        signUpDto.password = hashedPassword;

        try {
            // saving the user in the database
            const user = await this.userService.createUser(signUpDto);

            // setting the access token and expiresAt, from the userID
            const tokenPayload: TokenPayload = { id: user.id, role: user.role || 'USER' };
            const { token: accessToken, expiresAt: accessExpiresAt } =
                this.tokenService.generateAccessToken(tokenPayload);
            const { token: refreshToken, expiresAt: refreshExpiresAt } =
                this.tokenService.generateRefreshToken(tokenPayload);

            //stores the cookie in the HTTP response
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: accessExpiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });

            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: refreshExpiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
                sameSite: 'strict',
                path: '/auth/refresh',
            });

            this.emailTransportService
                .sendMail({
                    to: user.email,
                    subject: 'Welcome to our service!',
                    name: user.first_name,
                    content: "Thanks for signing up! We're glad to have you.",
                    templateName: 'welcome',
                })
                .catch((error) => {
                    console.error('Failed to send welcome email:', error);
                    // Don't throw — we don't want to fail signup because of email
                });

            //returning the user data without the id
            const { id, ...result } = user;
            return { data: result };
        } catch (error) {
            console.error('Failed to create user', error);
            throw new InternalServerErrorException('User creation failed.');
        }
    }

    // verify user
    async verifyUser(signInDto: SignInDto): Promise<{ data: User }> {
        const { identifier, password } = signInDto;

        //fetching the user from the database
        const user = await this.userService.getUser(identifier);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        //comparing the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return { data: user };
    }

    //signin user
    async signIn(signInDto: SignInDto, res: Response): Promise<Response> {
        try {
            //verifying and fetching the user, with Response.data
            const user = (await this.verifyUser(signInDto)).data;

            //assigning the token payload from the user ID
            const tokenPayload: TokenPayload = { id: user.id, role: user.role || 'USER' };

            //setting the access token and refresh token
            const { token: accessToken, expiresAt: accessExpiresAt } =
                this.tokenService.generateAccessToken(tokenPayload);
            const { token: refreshToken, expiresAt: refreshExpiresAt } =
                this.tokenService.generateRefreshToken(tokenPayload);

            //stores the cookie in the HTTP response
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: accessExpiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: refreshExpiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
                sameSite: 'strict',
                path: '/auth/refresh',
            });

            //returning the access token
            return res.json({
                accessToken,
                tokenType: 'Bearer',
                expiresAt: accessExpiresAt,
            });
        } catch (error) {
            console.error('Failed to sign in user', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    //reset password for signed in user
    async updatePassword(resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }> {
        try {
            // verify user
            const isUser = (
                await this.verifyUser({
                    identifier: resetPasswordDto.identifier,
                    password: resetPasswordDto.oldPassword,
                })
            ).data.id;

            //throw invalid credentiala for invalid user
            if (!isUser) {
                throw new UnauthorizedException('Invalid credentials');
            }

            //reset the password by updateing the user's password from the database
            await this.userService.updatePassword(resetPasswordDto.identifier, resetPasswordDto.newPassword);
            return { msg: 'Password reset successfully' };
        } catch (error) {}

        throw new Error('Method not implemented.');
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<{ msg: string }> {
        try {
            const updatedUser = await this.userService.updatePassword(
                forgetPasswordDto.identifier,
                forgetPasswordDto.newPassword,
            );
            return { msg: 'Password reset successfully' };
        } catch (error) {}

        throw new Error('Method not implemented.');
    }

    async requestPasswordChange(identifier: string): Promise<{ msg: string }> {
        try {
            const user = await this.userService.getUser(identifier);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const resetPasswordURL = this.configService.getOrThrow('resetPasswordURL');
            const token = this.tokenService.generateAccessToken({ id: user.id, role: user.role || 'USER' });
            const resetURL = `${resetPasswordURL}?token=${token}`;
            await this.emailTransportService.sendMail({
                to: user.email,
                subject: 'Password Reset Request',
                name: user.first_name,
                content: `Click the link to reset your password: ${resetURL}`,
                templateName: 'passwordReset',
            });
            return { msg: 'Password change request sent' };
        } catch (error) {
            throw new Error('Method not implemented.');
        }
    }
}
