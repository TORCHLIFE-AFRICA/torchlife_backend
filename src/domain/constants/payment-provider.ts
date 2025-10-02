import { PaystackService } from 'src/services/payments/provider/paystack.provider';

export const PaymentProviders = {
    paystack: PaystackService,
} as const;

export type PaymentProviderKey = keyof typeof PaymentProviders;
