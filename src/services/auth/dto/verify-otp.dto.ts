import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Otp', example: '321202' })
  @IsNotEmpty()
  @IsInt()
  otp: number | string;

  @ApiProperty({ description: 'User ID', example: '4316c5d5-1432-487b-8e43-0acf60162a7b' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
