import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto extends UserDto {}
export class SignInDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email or phone number used to sign in',
  })
  @IsNotEmpty({ message: 'Identifier is required' })
  @IsString({ message: 'Identifier must be a string' })
  identifier: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
export class ResetPasswordDto extends UpdatePasswordDto {}
export class ForgetPasswordDto extends PickType(UpdatePasswordDto, ['identifier', 'newPassword']) {}
