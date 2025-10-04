import { Injectable } from '@nestjs/common';
import { PaymentGatewayService } from 'src/domain/interface/payment-provider.interface';

@Injectable()
export class PaystackInboundService implements PaymentGatewayService {
    async initializePayment({ amount, tx_ref, currency, userId }) {
        // Call Paystack init endpoint
        return {
            authorization_url: 'https://paystack.com/pay/xyz',
            reference: tx_ref,
        };
    }

    async verifyPayment(payload: any) {
        const success = payload?.data?.status === 'success';
        const amount = payload?.data?.amount ?? 0;
        const currency = payload?.data?.currency ?? 'NGN';

        return {
            success,
            amount: amount / 100,
            currency,
            provider: 'paystack',
            raw: payload,
        };
    }
}
