import { EmailConfig } from '../../config';
import { EmailProvider } from '../../enum';

export const SMTP_CONFIG_KEY = 'SmtpConfig';

export class SmtpConfig extends EmailConfig {
  readonly provider = EmailProvider.SMTP;
  host: string;
  auth: {
    user: string;
    password: string;
  };
  port?: number;
  secure?: boolean;
  requireTLS?: boolean;
}
