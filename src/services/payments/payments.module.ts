import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
// import { PaymentsController } from './payments.controller';
import { BullModule } from '@nestjs/bull';
import { PaymentsProcessor } from './queue-process/payment.processor';
import { PaymentGatewayResolver } from './queue-process/payment.resolver';
import { PaystackService } from './provider/paystack.provider';

@Module({
    imports: [BullModule.registerQueue({ name: 'payment' })],
    providers: [PaymentsService, PaymentsProcessor, PaystackService],
    exports: [PaymentGatewayResolver],
    // controllers: [PaymentsController],
})
export class PaymentsModule {}
