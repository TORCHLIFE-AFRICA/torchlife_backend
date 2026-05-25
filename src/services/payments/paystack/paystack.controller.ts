import { Body, Controller, Headers, HttpCode, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user';
import { AuthUser } from 'src/shared/types/token-payload.types';
import { InitializePaystackDonationDto } from './dto/initialize-paystack-donation.dto';
import { PaystackInboundService } from '../inbound-providers/paystack.provider';
import { ApiStandardResponse, ApiCommonErrors } from 'src/shared/decorators/swagger.decorator';

class PaymentInitResponseDto {
  // Define response
}

class AuthResponseDto {
  // Shared empty response for success messages
}

@ApiTags('Payments')
@ApiCommonErrors()
@Controller('payments/paystack')
export class PaystackPaymentsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paystack: PaystackInboundService,
  ) { }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  @ApiOperation({
    summary: 'Initialize donation',
    description:
      'Creates a pending donation and payment record, then returns a Paystack checkout URL for the donor.',
  })
  @ApiStandardResponse(PaymentInitResponseDto, 201, 'Payment initialized successfully')
  async initializeDonation(@CurrentUser() user: AuthUser, @Body() dto: InitializePaystackDonationDto) {
    const donor = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!donor) throw new UnauthorizedException('User not found');

    const donation = await this.prisma.donation.create({
      data: {
        amount: dto.amount,
        status: 'PENDING',
        user_id: donor.id,
        campaign_id: dto.campaignId,
      },
    });

    const platformFeeAmount = Math.round(dto.amount * 0.02);
    const beneficiaryAmount = dto.amount - platformFeeAmount;

    const init = await this.paystack.initializePayment({
      userId: donor.email,
      amount: dto.amount,
      tx_ref: donation.id,
      currency: dto.currency ?? 'NGN',
      wallet_id: dto.campaignId,
      provider: undefined as any,
    });

    const payment = await this.prisma.payment.create({
      data: {
        amount: dto.amount,
        status: 'PENDING',
        tx_ref: init.reference,
        custom_tx_ref: donation.id,
        type: 'DEPOSIT',
        currency: (dto.currency ?? 'NGN') as any,
        provider: 'paystack',
        donation_id: donation.id,
        user_id: donor.id,
        meta: {
          fees: {
            platformFeePercent: 0.02,
            platformFeeAmount,
            beneficiaryAmount,
            paystackChargeAmount: null,
          },
          paystack: {
            reference: init.reference,
          },
        },
      },
    });

    return {
      data: {
        donationId: donation.id,
        paymentId: payment.id,
        authorizationUrl: init.authorization_url,
        reference: init.reference,
        amount: dto.amount,
        currency: dto.currency ?? 'NGN',
        fees: {
          platformFeePercent: 0.02,
          platformFeeAmount,
          beneficiaryAmount,
          paystackChargeAmount: null,
        },
      },
    };
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Paystack webhook listener',
    description:
      'Receives events from Paystack. Performs HMAC signature verification, fetches transaction status from Paystack API, and reconciles the database (Payment, Donation, and Campaign amounts).',
  })
  @ApiHeader({
    name: 'x-paystack-signature',
    description: 'HMAC SHA512 signature of the request body, signed with your Paystack secret key.',
    required: true,
  })
  @ApiStandardResponse(AuthResponseDto, 200, 'Webhook processed')
  async webhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('x-paystack-signature') signature?: string,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new UnauthorizedException('Paystack secret not configured');

    const raw = (req as any).rawBody;
    if (!raw || !Buffer.isBuffer(raw)) {
      throw new UnauthorizedException('Missing raw body for signature verification');
    }

    const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');
    if (!signature || signature !== expected) {
      throw new UnauthorizedException('Invalid Paystack signature');
    }

    const event: any = req.body;
    const reference = event?.data?.reference;
    const currency = event?.data?.currency ?? 'NGN';

    if (!reference) {
      return { data: { received: true, ignored: true } };
    }

    const verification = await this.paystack.verifyPayment({ reference, currency });
    const payment = await this.prisma.payment.findFirst({ where: { tx_ref: reference } });

    const webhookRow = await this.prisma.webhook.create({
      data: {
        event,
        payment_id: payment?.id ?? null,
      } as any,
    });

    if (!payment) {
      return { data: { received: true, verified: verification.success, webhookId: webhookRow.id } };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: verification.success ? 'SUCCESS' : 'FAILED', synced_at: new Date() },
      });

      if (payment.donation_id) {
        await tx.donation.update({
          where: { id: payment.donation_id },
          data: { status: verification.success ? 'SUCCESS' : 'FAILED' },
        });

        if (verification.success) {
          const donation = await tx.donation.findUnique({ where: { id: payment.donation_id } });
          if (donation) {
            await tx.campaign.update({
              where: { id: donation.campaign_id },
              data: { amount_raised: { increment: donation.amount } },
            });
          }
        }
      }
    });

    return { data: { received: true, verified: verification.success, webhookId: webhookRow.id } };
  }
}
