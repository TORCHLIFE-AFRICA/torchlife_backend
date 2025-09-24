import { User } from '@prisma/client';
import { Response } from 'express';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/auth/dto/auth.dto';

export interface IAuth {
    signUp(signUpDto: SignUpDto, response: Response): Promise<{ data: Omit<User, 'password' | 'id'> }>;
    signIn(signInDto: SignInDto, res: Response): Promise<Response>;
    verifyUser(signInDto: SignInDto): Promise<{ data: User }>;
    forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<{ msg: string }>;
    updatePassword(resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }>;
    requestPasswordChange(identifier: string): Promise<{ msg: string }>;
    // changePassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }>;
}
