import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/shared/types/token-payload.types';

const getCurrentUserByExecContext = (context: ExecutionContext): AuthUser => {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.user) throw new UnauthorizedException('Missing authenticated user');
    return req.user;
};

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): AuthUser =>
    getCurrentUserByExecContext(context),
);

export const currentUser = CurrentUser;
