import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { EmailTransportModule } from '../email-transport/email-transport.module';
import { TokenService } from './token/token.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, UserService, JwtService, TokenService],
    imports: [UserModule, EmailTransportModule],
    exports: [AuthService],
})
export class AuthModule {}
