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
    @ApiProperty({
        enum: CampaignType,
        enumName: 'CampaignType',
        description: 'Whether the campaign is for self or as a proxy for another beneficiary',
        example: CampaignType.USER,
    })
    @IsEnum(CampaignType)
    type: CampaignType;

    @ApiProperty({
        description: 'Title of the crowdfunding campaign',
        example: 'Medical Support for Baby John',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The compelling story behind the campaign',
        example: 'John is a 2-year old battling a rare condition...',
    })
    @IsString()
    @IsNotEmpty()
    story: string;

    @ApiProperty({
        description: 'URL to medical records or additional proof docs',
        example: 'https://res.cloudinary.com/demo/image/upload/records.jpg',
    })
    @IsString()
    record: string;

    @ApiProperty({
        description: 'URL to certified PDF document from a medical institution',
        example: 'https://res.cloudinary.com/demo/image/upload/cert.pdf',
    })
    @IsString()
    certified_pdf: string;

    @ApiProperty({
        description: 'Main cover image for the campaign',
        example: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
    })
    @IsString()
    image_url: string;

    @ApiProperty({
        description: 'The target date when the campaign should end',
        example: '2024-12-31T23:59:59Z',
    })
    @IsDateString()
    deadline: string;

    @ApiProperty({
        description: 'The total amount of money needed for the campaign',
        example: 500000,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    target_amount: number;

    @ApiProperty({
        required: false,
        description: 'Name of the beneficiary if the campaign is a proxy type',
        example: 'John Smith',
    })
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsString()
    @IsNotEmpty()
    proxyName: string;

    @ApiProperty({
        required: false,
        description: 'Phone number of the beneficiary if the campaign is a proxy type',
        example: '+2348012345678',
    })
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsPhoneNumber('NG')
    proxyPhone: string;

    @ApiProperty({
        required: false,
        description: 'Email of the beneficiary if the campaign is a proxy type',
        example: 'john.smith@example.com',
    })
    @ValidateIf((o) => o.type === CampaignType.PROXY)
    @IsEmail()
    proxyEmail: string;
}
