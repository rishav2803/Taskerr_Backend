import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;


  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>("GMAIL"),
        pass: this.configService.get<string>("GMAIL_PASSWORD"),
      },
    });
  }

  async sendMail(to: string, subject: string, text?: string, html?: string) {
    const mailOptions = {
      from: '"Rishav" <baxel281@gmail.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
