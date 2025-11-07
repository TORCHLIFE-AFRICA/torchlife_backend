import { PickType } from '@nestjs/mapped-types';
import { UserDto } from '../../user/dto/user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { IsString } from 'class-validator';

export class SignUpDto extends UserDto {}
// export class SignInDto extends PickType(UserDto, ['password']) {
//     identifier: string;
// }
export class SignInDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
export class ResetPasswordDto extends UpdatePasswordDto {}
export class ForgetPasswordDto extends PickType(UpdatePasswordDto, ['identifier', 'newPassword'] as const) {}
