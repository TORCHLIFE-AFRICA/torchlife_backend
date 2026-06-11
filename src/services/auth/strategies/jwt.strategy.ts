import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from 'src/shared/types/token-payload.types';
import { parseUserRole } from 'src/shared/utils/parse-user-role';

type RequestWithCookies = { cookies?: Record<string, string> };

const cookieExtractor = (req: RequestWithCookies | undefined): string | null => {
  if (!req?.cookies) return null;
  return req.cookies.accessToken ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    try {
      return {
        id: payload.sub,
        role: parseUserRole(payload.role),
      };
    } catch (e) {
      throw new UnauthorizedException((e as Error).message);
    }
  }
}
