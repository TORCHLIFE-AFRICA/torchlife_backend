import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
// import { IAuth } from '../../auth/auth.interface';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IAuth } from 'src/domain/interface/auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements IAuth {
    constructor(private readonly authService: AuthService) {}
    verifyUser(signInDto: SignInDto): Promise<{ data: User }> {
        throw new Error('Method not implemented.');
    }
    @Post('signup')
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ data: Omit<User, 'password' | 'id'> }> {
        const user = await this.authService.signUp(signUpDto, response);

        return user;
    }
    @Post('signin')
    async signIn(@Body() signInDto: SignInDto, @Res() res: Response): Promise<Response> {
        return this.authService.signIn(signInDto, res);
    }
    requestResetPassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    updatePassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    changePassword(): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
}
