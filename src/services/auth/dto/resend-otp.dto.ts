import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpDto {
    @ApiProperty({ description: 'User Email', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
}
