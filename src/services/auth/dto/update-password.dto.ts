import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    identifier: string;

    @IsString()
    @IsOptional()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}