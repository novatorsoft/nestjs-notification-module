import * as Nodemailer from 'nodemailer';
import { EmailService } from '../../email.service';
import { Inject, Injectable } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailArgs } from '../../dto';
import { SMTP_CONFIG_KEY, SmtpConfig } from './smtp.config';

@Injectable()
export class SmtpService extends EmailService {
  private readonly smtpClient: Nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @Inject(SMTP_CONFIG_KEY) private readonly smtpConfig: SmtpConfig,
  ) {
    super(smtpConfig);
    this.smtpClient = Nodemailer.createTransport({
      host: smtpConfig.host,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.password,
      },
      port: smtpConfig?.port ?? 465,
      secure:
        typeof smtpConfig?.secure === 'boolean' ? smtpConfig.secure : true,
      requireTLS:
        typeof smtpConfig?.requireTLS === 'boolean'
          ? smtpConfig.requireTLS
          : false,
    });
  }

  async sendAsync(sendEmailArgs: SendEmailArgs): Promise<boolean> {
    try {
      await this.smtpClient.sendMail({
        from: this.getFromEmail(sendEmailArgs),
        to: sendEmailArgs.to,
        subject: sendEmailArgs.subject,
        html: sendEmailArgs.content,
        cc: sendEmailArgs?.cc ?? [],
        bcc: sendEmailArgs?.bcc ?? [],
        attachments:
          sendEmailArgs.attachments?.map((attachment) => ({
            content: attachment.content,
            filename: attachment.filename,
            type: attachment.type,
            disposition: attachment.disposition ?? 'attachment',
            encoding: attachment.encoding,
          })) ?? [],
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
