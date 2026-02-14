import { IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    identifier: string;

    @IsString()
    newPassword: string;
}