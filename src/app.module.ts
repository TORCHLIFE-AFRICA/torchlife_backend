import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { EmailTransportService } from './email-transport/email-transport.service';
import { UploadModule } from './upload/upload.module';
import { CampaignModule } from './campaign/campaign.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        PaymentsModule,
        UploadModule,
        CampaignModule,
    ],
    controllers: [AppController],
    providers: [AppService, EmailTransportService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('campaigns');
    }
}
