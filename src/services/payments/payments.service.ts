import { InjectQueue } from '@nestjs/bull';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('payment') private paymentQueue: Queue,
    ) {}

    // 1. USER WALLET TOP-UP (Inbound)
    async initiateDeposit(userId: string, amount: number) {
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
            if (!wallet) throw new NotFoundException('User wallet not found');

            // Create Payment with wallet_id attached
            const payment = await tx.payment.create({
                data: {
                    amount,
                    status: 'PENDING',
                    tx_ref: `tx_${Date.now()}`,
                    custom_tx_ref: `deposit_${userId}_${Date.now()}`,
                    type: 'DEPOSIT',
                    currency: 'NGN',
                    user_id: userId,
                    wallet_id: wallet.id,
                },
            });

            // Create WalletTransaction
            const walletTx = await tx.walletTransaction.create({
                data: {
                    reference: payment.tx_ref,
                    amount,
                    type: 'DEPOSIT',
                    status: 'PENDING',
                    currency: 'NGN',
                    wallet_id: wallet.id,
                    payment_id: payment.id,
                    meta: { paymentId: payment.id },
                },
            });

            await this.paymentQueue.add('verify-payment', { paymentId: payment.id });

            return {
                message: 'Deposit queued',
                paymentId: payment.id,
                walletTxId: walletTx.id,
            };
        });
    }

    // 2. DONATION TO CAMPAIGN WALLET (move)
    async initiateDonation(userId: string, campaignId: string, amount: number, donation_id?: string) {
        const userWallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
        const campaignWallet = await this.prisma.wallet.findUnique({ where: { campaign_id: campaignId } });

        if (!userWallet) throw new NotFoundException('User wallet not found');
        if (!campaignWallet) throw new NotFoundException('Campaign wallet not found');
        if (userWallet.balance < amount) throw new BadRequestException('Insufficient funds');

        // Record payment and attach user's wallet_id
        const payment = await this.prisma.payment.create({
            data: {
                amount,
                status: 'PENDING',
                tx_ref: `tx_${Date.now()}`,
                custom_tx_ref: `donation_${userId}_${campaignId}_${Date.now()}`,
                currency: 'NGN',
                type: 'DEPOSIT',
                user_id: userId,
                wallet_id: userWallet.id,
                donation_id,
                meta: {
                    fromWalletId: userWallet.id,
                    toWalletId: campaignWallet.id,
                },
            },
        });

        await this.paymentQueue.add('process-donation', {
            paymentId: payment.id,
            fromWalletId: userWallet.id,
            toWalletId: campaignWallet.id,
        });

        return { message: 'Donation queued', paymentId: payment.id };
    }

    // 3. HOSPITAL PAYOUT (Outbound)
    async initiatePayout(campaignId: string, amount: number, hospitalAccount: any) {
        const campaignWallet = await this.prisma.wallet.findUnique({ where: { campaign_id: campaignId } });
        if (!campaignWallet) throw new NotFoundException('Campaign wallet not found');
        if (campaignWallet.balance < amount) throw new BadRequestException('Insufficient funds');

        const payment = await this.prisma.payment.create({
            data: {
                amount,
                status: 'PENDING',
                tx_ref: `tx_${Date.now()}`,
                custom_tx_ref: `payout_${campaignId}_${Date.now()}`,
                type: 'WITHDRAWAL',
                currency: 'NGN',
                wallet_id: campaignWallet.id,
                meta: hospitalAccount,
            },
        });

        await this.paymentQueue.add('process-payout', { paymentId: payment.id });

        return { message: 'Payout queued', paymentId: payment.id };
    }
}
