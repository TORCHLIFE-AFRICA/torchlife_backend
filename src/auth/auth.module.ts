import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, UserService, JwtService],
    imports: [UserModule],
    exports: [AuthService],
})
export class AuthModule {}
