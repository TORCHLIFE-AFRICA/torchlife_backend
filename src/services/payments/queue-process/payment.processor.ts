import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentGatewayResolver } from './payment.resolver';
import { PaymentProviderKey } from 'src/domain/constants/payment-provider';

@Processor('payment')
export class PaymentsProcessor {
    constructor(
        private prisma: PrismaService,
        private paymentGatewayResolver: PaymentGatewayResolver,
    ) {}

    // Verify deposit
    @Process('verify-payment')
    async handleVerifyPayment(job: Job<{ paymentId: string; provider: PaymentProviderKey }>) {
        const payment = await this.prisma.payment.findUnique({ where: { id: job.data.paymentId } });
        if (!payment) return;

        // TODO: call external API (Flutterwave/Paystack)
        const paymentGateway = this.paymentGatewayResolver.resolve(job.data.provider);
        const verificationResult = await paymentGateway.verifyPayment(job.data.paymentId);
        const success = verificationResult.success; // mock result

        await this.prisma.$transaction(async (tx) => {
            if (success) {
                await tx.wallet.update({
                    where: { id: payment.wallet_id! },
                    data: { balance: { increment: payment.amount } },
                });
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS' },
                });
            } else {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' },
                });
            }
        });
    }

    // Donation transfer
    @Process('process-donation')
    async handleDonation(job: Job<{ paymentId: string; fromWalletId: string; toWalletId: string }>) {
        const { paymentId, fromWalletId, toWalletId } = job.data;

        await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({ where: { id: paymentId } });
            if (!payment) return;

            const fromWallet = await tx.wallet.findUnique({ where: { id: fromWalletId } });
            if (!fromWallet || fromWallet.balance < payment.amount) throw new Error('Insufficient funds');

            await tx.wallet.update({
                where: { id: fromWalletId },
                data: { balance: { decrement: payment.amount } },
            });

            await tx.wallet.update({
                where: { id: toWalletId },
                data: { balance: { increment: payment.amount } },
            });

            await tx.payment.update({
                where: { id: payment.id },
                data: { status: 'SUCCESS' },
            });
        });
    }

    // Campaign payout
    @Process('process-payout')
    async handlePayout(job: Job<{ paymentId: string }>) {
        const { paymentId } = job.data;

        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) return;

        // TODO: integrate with bank API
        const success = true;

        await this.prisma.$transaction(async (tx) => {
            if (success) {
                await tx.wallet.update({
                    where: { id: payment.wallet_id! },
                    data: { balance: { decrement: payment.amount } },
                });
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS' },
                });
            } else {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' },
                });
            }
        });
    }
}
