import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { EmailTransportModule } from 'src/email-transport/email-transport.module';
import { TokenService } from './token/token.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, UserService, JwtService, TokenService],
    imports: [UserModule, EmailTransportModule, TokenService],
    exports: [AuthService],
})
export class AuthModule {}
