import { PaystackInboundService } from 'src/services/payments/inbound-providers/paystack.provider';
import { WalletPaymentGatewayService } from 'src/services/payments/inbound-providers/user-wallet.provider';

export const PaymentProviders = {
    paystack: PaystackInboundService,
    wallet: WalletPaymentGatewayService,
} as const;

export type PaymentProviderKey = keyof typeof PaymentProviders;
