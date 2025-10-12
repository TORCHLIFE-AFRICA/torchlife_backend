import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PaymentGatewayService } from 'src/domain/interface/payment-provider.interface';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { InitializeResponseEntity } from '../entities/initialized-payment-response.entity';

@Injectable()
export class PaystackInboundService implements PaymentGatewayService {
    private readonly secretKey = process.env.PAYSTACK_SECRET_KEY || '';

    private readonly currencyToProviderKey: Record<string, PaystackProviderKey> = {
        NGN: 'paystack_ngn',
        USD: 'paystack_usd',
    };

    private readonly endpoints: Record<PaystackProviderKey, { initialize: string; verify: (ref: string) => string }> = {
        paystack_ngn: {
            initialize: `${process.env.PAYSTACK_URL}/transaction/initialize`,
            verify: (ref: string) => `${process.env.PAYSTACK_URL}/transaction/verify/${ref}`,
        },
        paystack_usd: {
            initialize: `${process.env.PAYSTACK_USD_URL}/init-payment`,
            verify: (ref: string) => `${process.env.PAYSTACK_USD_URL}/verify-payment/${ref}`,
        },
    };

    private get headers() {
        return {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }

    async initializePayment(data: InitializePaymentDto): Promise<InitializeResponseEntity> {
        const { userId, amount, tx_ref, currency, wallet_id, provider } = data;

        const providerKey = provider || this.currencyToProviderKey[currency?.toUpperCase()];
        if (!providerKey || !this.endpoints[providerKey as PaystackProviderKey]) {
            throw new BadRequestException(`Unsupported currency: ${currency}`);
        }

        const payload = {
            amount: amount * 100,
            email: userId,
            subaccount: process.env.PAYSTACK_SUBACCOUNT_CODE || 'ACCT_8agl4nkdiebpkuk',
            transaction_charge: Number(process.env.PAYSTACK_CHARGE) || 15000,
            metadata: {
                tx_ref,
                currency,
                wallet_id,
            },
        };

        try {
            const endpoint = this.endpoints[providerKey as PaystackProviderKey].initialize;
            const response = await axios.post(endpoint, payload, { headers: this.headers });
            const responseData = response.data.data;

            return {
                provider: providerKey,
                authorization_url: responseData.authorization_url,
                access_code: responseData.access_code,
                reference: responseData.reference,
                currency,
                wallet_id,
                amount: amount * 100,
                tx_ref,
                ...responseData,
            } as InitializeResponseEntity;
        } catch (err) {
            const message = err?.response?.data || err.message || 'Unknown error initializing payment';
            throw new InternalServerErrorException(`Failed to initialize payment: ${JSON.stringify(message)}`);
        }
    }

    async verifyPayment({ reference, currency }: { reference: string; currency: string }) {
        const providerKey = this.currencyToProviderKey[currency?.toUpperCase()];
        if (!providerKey || !this.endpoints[providerKey]) {
            throw new BadRequestException(`Unsupported currency: ${currency}`);
        }

        try {
            const endpoint = this.endpoints[providerKey].verify(reference);
            const response = await axios.get(endpoint, { headers: this.headers });
            const data = response.data.data;

            return {
                success: data.status === 'success',
                amount: data.amount / 100,
                currency: data.currency,
                provider: providerKey,
                raw: response.data,
            };
        } catch (err) {
            const message = err?.response?.data || err.message || 'Unknown error verifying payment';
            throw new InternalServerErrorException(`Failed to verify payment: ${JSON.stringify(message)}`);
        }
    }
}
