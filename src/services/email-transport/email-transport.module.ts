import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailTransportService } from './email-transport.service';

@Module({
    providers: [EmailTransportService],
    exports: [EmailTransportService],
    imports: [ConfigModule],
})
export class EmailTransportModule {}
