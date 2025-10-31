import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { CustomHttpStatus } from './custom.exception';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: any =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception?.message || 'Internal Server Error';

        // Prisma-specific error capture
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            message = {
                code: exception.code,
                message: exception.message,
                meta: exception.meta,
            };
        }

        // Log the error with request context
        this.logger.error({
            method: request.method,
            path: request.url,
            body: request.body,
            statusCode: status,
            exception: exception?.name,
            message: message,
            stack: exception?.stack,
        });

        let clientMessage: string;

        if (exception instanceof HttpException) {
            const errorStatus = exception.getStatus();

            if (errorStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
                clientMessage = 'Something went wrong.';
            } else {
                clientMessage = typeof message === 'string' ? message : message.message || message;
            }
        } else {
            clientMessage = 'Something went wrong...';
        }

        // Send response to client
        response.status(status).json({
            statusCode: status,
            error:
                HttpStatus[status] === undefined
                    ? CustomHttpStatus[status]?.toLowerCase() || 'internal_server_error'
                    : HttpStatus[status].toLowerCase(),
            message: clientMessage,
        });
    }
}
