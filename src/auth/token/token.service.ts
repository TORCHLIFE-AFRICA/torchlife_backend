import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/shared/types/token-payload.types';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateAccessToken(payload: TokenPayload) {
        const expiresIn = this.configService.getOrThrow('JWT_EXPIRATION');
        const token = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: `${expiresIn}ms`,
        });
        return {
            token,
            expiresAt: new Date(Date.now() + parseInt(expiresIn)),
        };
    }

    generateRefreshToken(payload: TokenPayload) {
        const expiresIn = this.configService.getOrThrow('JWT_REFRESH_EXPIRATION');
        const token = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn,
        });
        return {
            token,
            expiresAt: new Date(Date.now() + parseInt(expiresIn)),
        };
    }

    verifyRefreshToken(token: string): TokenPayload {
        return this.jwtService.verify(token, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        });
    }
}
