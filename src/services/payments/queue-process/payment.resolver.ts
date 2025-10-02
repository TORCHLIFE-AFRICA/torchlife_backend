// src/payments/providers/payment-gateway.resolver.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaystackService } from '../provider/paystack.provider';
import { PaymentProviderKey } from 'src/domain/constants/payment-provider';
import { PaymentGatewayService } from 'src/domain/interface/payment-provider.interface';

@Injectable()
export class PaymentGatewayResolver {
    private readonly providers: Record<PaymentProviderKey, PaymentGatewayService>;

    constructor(private readonly paystack: PaystackService) {
        this.providers = {
            paystack: this.paystack,
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
