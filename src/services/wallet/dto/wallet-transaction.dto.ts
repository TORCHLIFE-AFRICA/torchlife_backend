import { IsString, IsUUID, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY } from '@prisma/client';

export class WalletTransactionDto {
    @ApiProperty({
        description: 'Unique transaction reference',
        example: 'TXN_1234567890',
    })
    @IsString()
    reference: string;

    @ApiProperty({
        description: 'Wallet ID to be credited',
        example: 'a7f9b0d0-d9a4-4c2f-a2c1-123456789abc',
    })
    @IsUUID()
    walletId: string;

    @ApiProperty({
        description: 'Amount to credit',
        example: 5000,
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'Currency of the transaction',
        enum: CURRENCY,
        example: CURRENCY.NGN,
    })
    @IsEnum(CURRENCY)
    currency: CURRENCY;

    @ApiPropertyOptional({
        description: 'Optional description for the transaction',
        example: 'Credit from user deposit',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Additional metadata for the transaction',
        example: { source: 'mobile-app', ip: '192.168.1.1' },
    })
    @IsOptional()
    meta?: any; // You can replace with Record<string, any> for stricter typing
}
