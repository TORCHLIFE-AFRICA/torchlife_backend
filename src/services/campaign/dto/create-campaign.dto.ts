import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    ValidateIf,
    IsPhoneNumber,
    IsEmail,
    IsDateString,
    IsInt,
    Min,
    IsEnum,
} from 'class-validator';
import { USER_ROLES } from '@prisma/client';

export class CreateCampaignDto {
    @ApiProperty({ enum: USER_ROLES, enumName: 'CampaignType' })
    @IsEnum(USER_ROLES)
    type: USER_ROLES;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    story: string;

    @ApiProperty()
    @IsString()
    record: string;

    @ApiProperty()
    @IsString()
    certified_pdf: string;

    @ApiProperty()
    @IsString()
    image_url: string;

    @ApiProperty()
    @IsDateString()
    deadline: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    target_amount: number;

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.type === USER_ROLES.PROXY)
    @IsString()
    @IsNotEmpty()
    proxyName: string;

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.type === USER_ROLES.PROXY)
    @IsPhoneNumber('NG')
    proxyPhone: string;

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.type === USER_ROLES.PROXY)
    @IsEmail()
    proxyEmail: string;
}
