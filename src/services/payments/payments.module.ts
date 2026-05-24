import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BullModule } from '@nestjs/bull';
import { PaymentsProcessor } from './queue-process/payment.processor';
import { PaymentGatewayResolver } from './queue-process/inbound-payment.resolver';
import { PaystackInboundService } from './inbound-providers/paystack.provider';
import { WalletPaymentGatewayService } from './inbound-providers/user-wallet.provider';
import { PaystackPaymentsController } from './paystack/paystack.controller';

@Module({
    imports: [BullModule.registerQueue({ name: 'payment' })],
    controllers: [PaystackPaymentsController],
    providers: [
        PaymentsService,
        PaymentsProcessor,
        PaystackInboundService,
        PaymentGatewayResolver,
        WalletPaymentGatewayService,
    ],
    exports: [PaymentGatewayResolver],
})
export class PaymentsModule {}
