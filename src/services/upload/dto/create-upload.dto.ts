import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UploadVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export enum UploadType {
    CAMPAIGN_IMAGE = 'CAMPAIGN_IMAGE',
    HOSPITAL_DOCUMENT = 'HOSPITAL_DOCUMENT',
    MEDICAL_REPORT = 'MEDICAL_REPORT',
}

export class CreateUploadDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload file',
    })
    file: any;

    @ApiProperty({
        example: 'clx123campaign',
        description: 'Campaign ID',
    })
    @IsNotEmpty()
    @IsString()
    campaignId: string;

    @ApiProperty({
        enum: UploadVisibility,
        example: UploadVisibility.PRIVATE,
    })
    @IsNotEmpty()
    @IsEnum(UploadVisibility)
    visibility: UploadVisibility;

    @ApiProperty({
        enum: UploadType,
        example: UploadType.HOSPITAL_DOCUMENT,
    })
    @IsNotEmpty()
    @IsEnum(UploadType)
    type: UploadType;

    @ApiProperty({
        example: 'Hospital invoice for surgery',
        required: false,
        description: 'Description of the upload',
    })
    @IsOptional()
    @IsString()
    description?: string;
}