import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailTransportService } from 'src/email-transport/email-transport.service';

@Module({
    providers: [EmailTransportService],
    exports: [EmailTransportService],
    imports: [ConfigModule],
})
export class EmailTransportModule {}
