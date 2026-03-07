import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ForgetPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from 'src/services/auth/dto/auth.dto';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { IAuth } from 'src/domain/interface/auth.interface';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController implements IAuth {
    constructor(private readonly authService: AuthService) {}

    // -------------------------
    // REQUIRED BY IAuth
    // -------------------------

    @Post('signup')
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ data: Omit<User, 'password' | 'id'> }> {
        return this.authService.signUp(signUpDto, response);
    }

    @Post('signin')
    async signIn(
        @Body() signInDto: SignInDto,
        @Res() res: Response,
    ): Promise<Response> {
        return this.authService.signIn(signInDto, res);
    }

    async verifyUser(signInDto: SignInDto): Promise<{ data: User }> {
        return this.authService.verifyUser(signInDto);
    }

    @Post('forget-password')
    async forgetPassword(
        @Body() forgetPasswordDto: ForgetPasswordDto,
    ): Promise<{ msg: string }> {
        return this.authService.forgetPassword(forgetPasswordDto);
    }

    @Post('reset-password')
    async updatePassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<{ msg: string }> {
        return this.authService.updatePassword(resetPasswordDto);
    }

    @Post('request-password-change')
    async requestPasswordChange(
        @Body() body: { identifier: string },
    ): Promise<{ msg: string }> {
        return this.authService.requestPasswordChange(body.identifier);
    }

    // -------------------------
    // EXTRA ENDPOINTS
    // -------------------------

    @Post('resend-email-otp')
    @ApiOperation({ summary: 'Resend email verification OTP' })
    async resendEmailOtp(@Body() dto: ResendOtpDto) {
        return this.authService.resendOtp({
            email: dto.email,
            forWhat: { email: true },
        });
    }

    @Post('verify-email-otp')
    @ApiOperation({ summary: 'Verify email OTP' })
    async verifyEmailOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto, { email: true });
    }

    @Post('refresh')
    async refreshToken(@Res({ passthrough: true }) response: Response) {
        return this.authService.refreshToken(response);
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const accessToken = req.cookies['accessToken'];

        if (accessToken) {
            const decoded = this.authService.verifyAccessToken(accessToken);
            await this.authService.logout(decoded.id);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return { message: 'Logged out successfully' };
    }
}
