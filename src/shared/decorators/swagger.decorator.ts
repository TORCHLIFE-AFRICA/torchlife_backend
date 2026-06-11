import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
  ApiProperty,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export class ApiStandardResponseDto<TData> {
  @ApiProperty({ description: 'Indicates if the request was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response message', example: 'Operation successful' })
  message: string;

  @ApiProperty({ description: 'Response data payload' })
  data: TData;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'An error occurred' })
  message: string;

  @ApiProperty({ description: 'Detailed validation errors if any', required: false, type: [String] })
  errors?: string[];
}

export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
  message = 'Operation successful',
) => {
  return applyDecorators(
    ApiExtraModels(ApiStandardResponseDto, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiStandardResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
              message: { type: 'string', example: message },
              success: { type: 'boolean', example: true },
            },
          },
        ],
      },
    }),
  );
};

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid request body or parameters',
      type: ApiErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Missing or invalid token',
      type: ApiErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
      type: ApiErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ApiErrorResponseDto,
    }),
  );
};
