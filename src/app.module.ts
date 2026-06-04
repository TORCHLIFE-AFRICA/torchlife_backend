import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './services/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './services/user/user.module';
import { PaymentsModule } from './services/payments/payments.module';
import { EmailTransportService } from './services/email-transport/email-transport.service';
import { UploadModule } from './services/upload/upload.module';
import { CampaignModule } from './services/campaign/campaign.module';
import { BullModule } from '@nestjs/bull';
import { CampaignsModule } from './new/campaign/campaigns.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        PaymentsModule,
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
        }),
        UploadModule,
        CampaignModule,
<<<<<<< HEAD
        WalletModule,
        CampaignsModule
=======
>>>>>>> fc3dc30458f5664de1a02fa12a4fd04f3655fa86
    ],
    controllers: [AppController],
    providers: [AppService, EmailTransportService],
})
export class AppModule {}
