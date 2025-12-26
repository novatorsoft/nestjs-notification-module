import { Inject, Injectable } from '@nestjs/common';
import { EmailService } from '../../email.service';
import { SendEmailArgs } from '../../dto';
import { SENDGRID_CONFIG_KEY, SendgridConfig } from './sendgrid.config';
import * as SendgridMail from '@sendgrid/mail';

@Injectable()
export class SendgridService extends EmailService {
  constructor(
    @Inject(SENDGRID_CONFIG_KEY)
    private readonly sendgridConfig: SendgridConfig,
  ) {
    super(sendgridConfig);
  }

  async sendAsync(sendEmailArgs: SendEmailArgs): Promise<boolean> {
    const fromEmail = this.getFromEmail(sendEmailArgs);
    try {
      SendgridMail.setApiKey(this.sendgridConfig.apiKey);
      await SendgridMail.send({
        from: fromEmail,
        to: sendEmailArgs.to,
        subject: sendEmailArgs.subject,
        html: sendEmailArgs.content,
        cc: sendEmailArgs.cc ?? [],
        bcc: sendEmailArgs.bcc ?? [],
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
