// src/payments/providers/payment-gateway.resolver.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaystackInboundService } from '../inbound-providers/paystack.provider';
import { PaymentProviderKey } from 'src/domain/constants/payment-provider';
import { PaymentGatewayService } from 'src/domain/interface/payment-provider.interface';
import { WalletPaymentGatewayService } from '../inbound-providers/user-wallet.provider';

@Injectable()
export class PaymentGatewayResolver {
    private readonly providers: Record<PaymentProviderKey, PaymentGatewayService>;

    constructor(
        private readonly paystack: PaystackInboundService,
        private readonly wallet: WalletPaymentGatewayService,
    ) {
        this.providers = {
            paystack: this.paystack,
            wallet: this.wallet,
        };
    }

    resolve(provider: PaymentProviderKey): PaymentGatewayService {
        const service = this.providers[provider];
        if (!service) {
            throw new NotFoundException(`Unsupported payment provider: ${provider}`);
        }
        return service;
    }
}
