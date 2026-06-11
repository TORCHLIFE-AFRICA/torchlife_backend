import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from 'src/shared/types/token-payload.types';
import { parseUserRole } from 'src/shared/utils/parse-user-role';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateAccessToken(user: AuthUser) {
        const expiresIn = this.configService.getOrThrow('JWT_EXPIRATION');
        const payload: JwtPayload = { sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: `${expiresIn}ms`,
        });
        return {
            token,
            expiresAt: new Date(Date.now() + parseInt(expiresIn)),
        };
    }

    generateRefreshToken(user: AuthUser) {
        const expiresIn = this.configService.getOrThrow('JWT_REFRESH_EXPIRATION');
        const payload: JwtPayload = { sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn,
        });
        return {
            token,
            expiresAt: new Date(Date.now() + parseInt(expiresIn)),
        };
    }

    verifyRefreshToken(token: string): AuthUser {
        const payload = this.jwtService.verify<JwtPayload>(token, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        });
        return { id: payload.sub, role: parseUserRole(payload.role) };
    }

    verifyAccessToken(token: string): AuthUser {
        const payload = this.jwtService.verify<JwtPayload>(token, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
        });
        return { id: payload.sub, role: parseUserRole(payload.role) };
    }
}
