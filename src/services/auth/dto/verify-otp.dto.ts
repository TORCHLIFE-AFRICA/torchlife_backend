import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The 6-digit numeric OTP code received via email',
    example: 321202,
  })
  @IsNotEmpty()
  @IsInt()
  otp: number;

  @ApiProperty({
    description: 'The unique identifier of the user to verify',
    example: '4316c5d5-1432-487b-8e43-0acf60162a7b',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
