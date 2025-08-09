import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailTransportService {
    private readonly transporter: Transporter;
    private readonly configService: ConfigService;
    private readonly logger = new Logger(EmailTransportService.name);

    constructor(configService: ConfigService) {
        this.configService = configService;
        //calling the transporter from nodemailer to send emails with the mail creds
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow('MAIL_HOST'),
            port: Number(this.configService.getOrThrow('MAIL_PORT')) || 587,
            secure: this.configService.getOrThrow('MAIL_SECURE') === 'true',
            auth: {
                user: this.configService.getOrThrow('MAIL_USER'),
                pass: this.configService.getOrThrow('MAIL_PASS'),
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.getOrThrow('MAIL_FROM'),
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
}
