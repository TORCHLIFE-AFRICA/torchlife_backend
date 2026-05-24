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

export enum CampaignType {
    USER = 'USER',
    PROXY = 'PROXY',
}

export class CreateCampaignDto {
    @ApiProperty({ enum: CampaignType, enumName: 'CampaignType' })
    @IsEnum(CampaignType)
    type: CampaignType;

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
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsString()
    @IsNotEmpty()
    proxyName: string;

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsPhoneNumber('NG')
    proxyPhone: string;

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsEmail()
    proxyEmail: string;
}
