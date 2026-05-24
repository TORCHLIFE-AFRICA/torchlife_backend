import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export enum PaystackCurrency {
  NGN = 'NGN',
  USD = 'USD',
}

export class InitializePaystackDonationDto {
  @ApiProperty({ description: 'Campaign ID', example: '4316c5d5-1432-487b-8e43-0acf60162a7b' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'Donation amount in major units (e.g. NGN)', example: 5000 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ enum: PaystackCurrency, default: PaystackCurrency.NGN })
  @IsOptional()
  @IsEnum(PaystackCurrency)
  currency?: PaystackCurrency = PaystackCurrency.NGN;
}

