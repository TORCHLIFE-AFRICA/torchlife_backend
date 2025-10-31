import { HttpException, HttpStatus } from '@nestjs/common';

export enum CustomHttpStatus {
  NOT_ENOUGH_PROPERTY = 430,
  PAYMENT_FAILED = 431,
  BREVO_FAILED = 432,
  STORAGE_FAILED = 433,
};

export class NotEnoughPropertyException extends HttpException {
  constructor(message: string = 'Not enough property available') {
    super(
      {
        statusCode: CustomHttpStatus.NOT_ENOUGH_PROPERTY,
        message,
        error: 'NotEnoughPropertyException',
      },
      CustomHttpStatus.NOT_ENOUGH_PROPERTY,
    );
  }
}

export class PaymentFailedException extends HttpException {
  constructor(message: string = 'Payment failed') {
    super(
      {
        statusCode: CustomHttpStatus.PAYMENT_FAILED,
        message,
        error: 'PaymentFailedException',
      },
      CustomHttpStatus.PAYMENT_FAILED,
    );
  }
}

export class BrevoFailedException extends HttpException {
  constructor(message: string = 'Brevo failed') {
    super(
      {
        statusCode: CustomHttpStatus.BREVO_FAILED,
        message,
        error: 'BrevoFailedException',
      },
      CustomHttpStatus.BREVO_FAILED,
    );
  }
}

export class AlreadyReportedException extends HttpException {
  constructor(message: string = 'Already reported') {
    super(
      {
        statusCode: HttpStatus.ALREADY_REPORTED,
        message,
        error: 'AlreadyReported',
      },
      HttpStatus.ALREADY_REPORTED,
    );
  }
}

export class StorageFailedException extends HttpException {
  constructor(message: string = 'Storage failed') {
    super(
      {
        statusCode: CustomHttpStatus.STORAGE_FAILED,
        message,
        error: 'StorageFailedException',
      },
      CustomHttpStatus.STORAGE_FAILED,
    );
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string = 'Too many requests') {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        error: 'TooManyRequests',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}