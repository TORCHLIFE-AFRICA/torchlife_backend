import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Try cookie first
        let token = req.cookies?.accessToken;

        // If not in cookie, check Authorization header
        if (!token && req.headers.authorization) {
            const [scheme, value] = req.headers.authorization.split(' ');
            if (scheme === 'Bearer' && value) token = value;
        }

        if (!token) throw new UnauthorizedException('Missing access token');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as { id: string };
            req.user = { id: decoded.id };
            next();
        } catch {
            throw new UnauthorizedException('Token invalid or expired');
        }
    }
}
