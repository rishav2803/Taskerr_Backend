import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agenda } from 'agenda';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private agenda: Agenda;


  constructor(private configService: ConfigService) {
    this.agenda = new Agenda({
      db: { address: this.configService.get<string>("MONGO_URI"), collection: "agendaJobs" },
      processEvery: '30 seconds'
    })

    this.defineEmailJob();
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



  private defineEmailJob() {
    this.agenda.define('send email', async (job: any) => {
      const { to, subject, text, html } = job.attrs.data;
      await this.sendMail(to, subject, text, html);
    });
  }

  async scheduleEmail(to: string, subject: string, text?: string, html?: string) {
    await this.agenda.now('send email', { to, subject, text, html });
  }

  async onModuleInit() {
    await this.agenda.start();
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
