import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
// export class AuthController implements IAuth {
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    async verifyUser(signInDto: SignInDto): Promise<{ data: Omit<User, 'password'> }> {
        return await this.authService.verifyUser(signInDto);
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
    async signIn(
        @Body() signInDto: SignInDto,
        @Res() res: Response
    ) {
        return this.authService.signIn(signInDto, res);
    }

    // requestResetPassword(): Promise<{ msg: string }> {
    //     throw new Error('Method not implemented.');
    // }

    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto, @Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
        return this.authService.forgetPassword(forgetPasswordDto)
    }

    @Post('reset-password')
    async updatePassword(@Body() resetPasswordDto: ResetPasswordDto, @Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
        return this.authService.updatePassword(resetPasswordDto)
    }
}
