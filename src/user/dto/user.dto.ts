import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ROLES } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

const { PROXY, USER } = USER_ROLES;
type UserRole = typeof PROXY | typeof USER;

export class UserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'StrongPassword123!',
        description: 'Must contain upper, lower, number, symbol',
    })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @ApiPropertyOptional({ example: '+2348012345678' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @ApiProperty({ example: [PROXY, USER] })
    @IsOptional()
    @IsEnum([PROXY, USER])
    role: UserRole;
}
