import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { promises as fs } from 'fs';
import { join } from 'path';
import { SendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailTransportService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(EmailTransportService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow('EMAIL_HOST'),
      port: Number(this.configService.getOrThrow('EMAIL_PORT')) || 587,
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.getOrThrow('EMAIL_USER'),
        pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(sendEmailDto: SendEmailDto) {
    try {

      const templateFile = sendEmailDto.templateName?.endsWith('.html')
        ? sendEmailDto.templateName
        : `${sendEmailDto.templateName || 'welcome'}.html`;

      const templatePath = join(__dirname, '..', 'email-templates', templateFile);

      // Use async file reading (non-blocking)
      const templateContent = await fs.readFile(templatePath, 'utf-8');

      const html = templateContent
        .replace(/{{\s*name\s*}}/g, sendEmailDto.name || '')
        .replace(/{{\s*content\s*}}/g, sendEmailDto.content || '');

      const info = await this.transporter.sendMail({
        from: this.configService.getOrThrow('EMAIL_SENDER'),
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html,
      });

      this.logger.log(
        `Email sent to ${sendEmailDto.to} (Message ID: ${info.messageId})`,
      );

      return info;
    } catch (error) {
      this.logger.error(`Email sending failed: ${error}`);
      throw error;
    }
  }
}