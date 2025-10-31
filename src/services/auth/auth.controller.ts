import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
// import { IAuth } from '../../auth/auth.interface';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IAuth } from 'src/domain/interface/auth.interface';
import { AuthService } from './auth.service';
import { async } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

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

    @Post('resend-email-otp')
    @ApiOperation({ summary: 'Resend email verification opt' })
    async resendEmailOtp(@Body() forgotPasswordDto: ResendOtpDto) {
        return this.authService.resendOtp({
            email: forgotPasswordDto.email,
            forWhat: { email: true },
        });
    }

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto, @Res() res: Response): Promise<Response> {
        return this.authService.signIn(signInDto, res);
    }

    @Post('request')
    async requestPasswordChange(@Body() identifier: string): Promise<{ msg: string }> {
        await this.authService.requestPasswordChange(identifier);
        return { msg: 'Password change request sent' };
    }

    @Post('verify-email-otp')
    @ApiOperation({ summary: 'Verify email otp' })
    async verifyEmailOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto, { email: true });
    }
    forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
    updatePassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ msg: string }> {
        throw new Error('Method not implemented.');
    }
}
