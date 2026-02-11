import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';

export interface IAuth {
    signUp(signUpDto: SignUpDto, response: Response): Promise<{ data: Omit<User, 'password' | 'id'> }>;

    signIn(signInDto: SignInDto, res: Response): Promise<Response>;

    verifyUser(signInDto: SignInDto): Promise<{ data: User }>;

    forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<{ msg: string }>;

    updatePassword(resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }>;

    requestPasswordChange(data: { identifier: string }): Promise<{ msg: string }>;

    refreshToken(response: Response): Promise<{ accessToken: string }>;

    logout(req: Request, res: Response): Promise<{ message: string }>;
}
