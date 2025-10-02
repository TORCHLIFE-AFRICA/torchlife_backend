import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('deposit')
    deposit(@Body() body: { userId: string; amount: number }) {
        return this.paymentsService.initiateDeposit(body.userId, body.amount);
    }

    @Post('donation')
    donate(@Body() body: { userId: string; campaignId: string; amount: number; donation_id?: string }) {
        return this.paymentsService.initiateDonation(body.userId, body.campaignId, body.amount, body.donation_id);
    }

    @Post('payout')
    payout(@Body() body: { campaignId: string; amount: number; hospitalAccount: any }) {
        return this.paymentsService.initiatePayout(body.campaignId, body.amount, body.hospitalAccount);
    }
}
