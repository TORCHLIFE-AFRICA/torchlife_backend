import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export enum UserRole {
    USER = 'USER',
    PROXY = 'PROXY',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

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

    @ApiProperty({ example: 'USER' })
    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;
}
