import { EmailConfigType } from './config';
import { Logger } from '@nestjs/common';
import { SendEmailArgs } from './dto';

export abstract class EmailService {
  protected readonly logger = new Logger(EmailService.name);

  constructor(private readonly emailConfig: EmailConfigType) {}

  abstract sendAsync(sendEmailArgs: SendEmailArgs): Promise<boolean>;

  protected getFromEmail(sendEmailArgs: SendEmailArgs): string {
    const fromEmail =
      sendEmailArgs?.from ?? this.emailConfig.defaultFromAddress;
    if (!fromEmail) throw new Error('From address is required');
    return fromEmail;
  }
}
