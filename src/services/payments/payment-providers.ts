import { PaystackInboundService } from './inbound-providers/paystack.provider';
import { WalletPaymentGatewayService } from './inbound-providers/user-wallet.provider';

export const PaymentProvidersMap = {
    paystack: PaystackInboundService,
    user_wallet: WalletPaymentGatewayService,
} as const;

export type PaymentProviderKey = keyof typeof PaymentProvidersMap;
