import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export enum PaystackCurrency {
  NGN = 'NGN',
  USD = 'USD',
}

export class InitializePaystackDonationDto {
  @ApiProperty({
    description: 'The unique identifier of the campaign being donated to',
    example: '4316c5d5-1432-487b-8e43-0acf60162a7b',
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({
    description: 'Donation amount in major units (e.g. 5000 for 5,000 NGN)',
    example: 5000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    enum: PaystackCurrency,
    default: PaystackCurrency.NGN,
    description: 'Currency for the transaction (NGN or USD)',
  })
  @IsOptional()
  @IsEnum(PaystackCurrency)
  currency?: PaystackCurrency = PaystackCurrency.NGN;
}

