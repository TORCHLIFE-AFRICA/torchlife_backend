import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentProviderKey } from 'src/domain/constants/payment-provider';

export class InitializePaymentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The user ID' })
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'The amount to pay' })
    amount: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The payment provider key' })
    provider: PaymentProviderKey;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The wallet ID' })
    wallet_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The transaction reference' })
    tx_ref: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The currency' })
    currency: string;
}
