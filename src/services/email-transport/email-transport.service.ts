import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { join } from 'path';
import { Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailTransportService {
    private readonly transporter: Transporter;
    private readonly configService: ConfigService;
    private readonly logger = new Logger(EmailTransportService.name);

    constructor(configService: ConfigService) {
        this.configService = configService;
        //calling the transporter from nodemailer to send emails with the mail creds
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow('EMAIL_HOST'),
            port: Number(this.configService.getOrThrow('EMAIL_PORT')) || 587,
            secure: this.configService.getOrThrow('EMAIL_SECURE') === 'true',
            auth: {
                user: this.configService.getOrThrow('EMAIL_USER'),
                pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
            },
        });
    }

    async sendMail(sendEmailDto: SendEmailDto) {
        // const isDev = process.env.NODE_ENV !== 'production';
        // const templatePath = isDev
        //     ? join(__dirname, '..', 'email-templates', 'welcome.html') // during dev
        //     : join(__dirname, '..', '..', 'email-templates', sendEmailDto.templateName); // in dist
        // const templateContent = fs.readFileSync(templatePath, 'utf-8');
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.getOrThrow('EMAIL_SENDER'),
                to: sendEmailDto.to,
                subject: sendEmailDto.subject,
                html: sendEmailDto.content
                    .replace('{{content}}', sendEmailDto.content)
                    .replace('{{name}}', sendEmailDto.name),
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
}
