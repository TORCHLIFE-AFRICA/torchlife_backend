import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
// import { ConversionService } from './currency/conversion/conversion.service';
import { EmailTransportService } from './email-transport/email-transport.service';
import { UploadModule } from './upload/upload.module';

@Module({
    imports: [PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), UserModule, PaymentsModule, UploadModule],
    controllers: [AppController],
    providers: [AppService, EmailTransportService],
})
export class AppModule { }
