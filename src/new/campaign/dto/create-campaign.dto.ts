import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

/* =========================
   ENUMS
========================= */

export enum UpdateVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PRIVATE_DONOR = 'PRIVATE_DONOR',
}

export enum SubmitterType {
  SELF = 'SELF',
  PROXY = 'PROXY',
}

export enum CampaignCategory {
  URGENT = 'URGENT',
  MILESTONE = 'MILESTONE',
  OFFSET = 'OFFSET',
  FIRSTFUND = 'FIRSTFUND',
}

/* =========================
   UPDATE DTO
========================= */

export class CreateCampaignUpdateDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsEnum(UpdateVisibility)
  visibility!: UpdateVisibility;

  @IsString()
  @IsNotEmpty()
  createdBy!: string;
}

/* =========================
   SUB DTOs
========================= */

class SubmitterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;
}

class BeneficiaryDto {
  @IsString()
  name!: string;

  @IsString()
  countryOfResidence!: string;

  @IsDateString()
  expectedDateOfDelivery!: string;

  @IsArray()
  @IsString({ each: true })
  medicalConditions!: string[];
}

class CampaignDto {
  @IsString()
  title!: string;

  @IsEnum(CampaignCategory)
  category!: CampaignCategory;

  @IsString()
  story!: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  amountNeeded!: number;

  @IsString()
  currency!: string;
}

class HospitalDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;
}

class ConsentDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreed!: boolean;

  @IsDateString()
  agreedAt!: string;
}

/* =========================
   MAIN DTO
========================= */

export class CreateCampaignDto {
  @IsEnum(SubmitterType)
  submitterType!: SubmitterType;

  @IsOptional()
  @ValidateNested()
  @Type(() => SubmitterDto)
  submitter?: SubmitterDto;

  @ValidateNested()
  @Type(() => BeneficiaryDto)
  beneficiary!: BeneficiaryDto;

  @ValidateNested()
  @Type(() => CampaignDto)
  campaign!: CampaignDto;

  @ValidateNested()
  @Type(() => HospitalDto)
  hospital!: HospitalDto;

  @ValidateNested()
  @Type(() => ConsentDto)
  consent!: ConsentDto;
}