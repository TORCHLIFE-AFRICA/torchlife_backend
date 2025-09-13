import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPayload } from 'src/shared/types/token-payload.types';
import { IAuth } from 'src/domain/interface/auth.interface';
import { EmailTransportService } from 'src/email-transport/email-transport.service';

@Injectable()
export class AuthService implements IAuth {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailTransportService: EmailTransportService,
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
            const tokenPayload: TokenPayload = { id: user.id };
            //setting the access token and expiresAt, from the userID
            const accessToken = this.jwtService.sign(tokenPayload, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
                expiresIn: `${this.configService.getOrThrow('JWT_EXPIRATION')}ms`,
            });
            //expiration
            const expiresAt = new Date(Date.now() + parseInt(this.configService.getOrThrow('JWT_EXPIRATION')));
            //stores the cookie in the HTTP response
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                expires: expiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });
            //returning the access token
            return res.json({
                accessToken,
                tokenType: 'Bearer',
                expiresAt,
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
            const isUser = (
                await this.verifyUser({
                    identifier: forgetPasswordDto.identifier,
                    password: forgetPasswordDto.newPassword,
                })
            ).data.id;
            if (!isUser) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const updatedUser = await this.userService.updatePassword(
                forgetPasswordDto.identifier,
                forgetPasswordDto.newPassword,
            );
            return { msg: 'Password reset successfully' };
        } catch (error) {}

        throw new Error('Method not implemented.');
    }
    changePassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
}
