import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Email or phone number of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiPropertyOptional({
    description: 'Current password (required for password change, optional for reset)',
    example: 'OldPassword123!',
  })
  @IsString()
  @IsOptional()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password to set',
    example: 'NewStrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}