import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletTransactionDto } from './dto/wallet-transaction.dto';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) {}
    async createWalletForUser(createWalletDto: CreateWalletDto) {
        const { id, currency } = createWalletDto;
        return this.prisma.wallet.create({ data: { user_id: id, balance: 0, currency } });
    }

    async getBalance(userId: string) {
        const w = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
        if (!w) throw new NotFoundException('Wallet not found');
        return { balance: w.balance, currency: w.currency };
    }

    async creditWallet(creditWalletDto: WalletTransactionDto) {
        const { amount, currency, description, reference, meta, walletId } = creditWalletDto;
        // idempotent: ensure WalletTransaction.reference not exist
        return this.prisma.$transaction(async (tx) => {
            const exist = await tx.walletTransaction.findUnique({ where: { reference } });
            if (exist) return exist;

            const walletTx = await tx.walletTransaction.create({
                data: {
                    reference,
                    amount,
                    type: 'DEPOSIT',
                    currency,
                    status: 'SUCCESS',
                    description,
                    meta,
                    wallet_id: walletId,
                },
            });

            await tx.wallet.update({ where: { id: walletId }, data: { balance: { increment: amount } } });
            return walletTx;
        });
    }

    async debitWallet(debitWalletDto: WalletTransactionDto) {
        const { amount, currency, description, reference, meta, walletId } = debitWalletDto;

        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
            if (!wallet) throw new NotFoundException('Wallet not found');
            if (wallet.balance < amount) throw new BadRequestException('Insufficient balance');

            const exist = await tx.walletTransaction.findUnique({ where: { reference } });
            if (exist) return exist;

            const walletTx = await tx.walletTransaction.create({
                data: {
                    reference,
                    amount,
                    type: 'WITHDRAWAL',
                    currency,
                    status: 'SUCCESS',
                    description,
                    meta,
                    wallet_id: walletId,
                },
            });

            await tx.wallet.update({ where: { id: walletId }, data: { balance: { decrement: amount } } });
            return walletTx;
        });
    }

    remove(id: number) {
        return `This action removes a #${id} wallet`;
    }
}
