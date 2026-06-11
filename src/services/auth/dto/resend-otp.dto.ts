import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'The registered email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
