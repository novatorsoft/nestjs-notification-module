import { EmailConfig } from '../../config';
import { EmailProvider } from '../../enum';

export const SENDGRID_CONFIG_KEY = 'SendgridConfig';

export class SendgridConfig extends EmailConfig {
  readonly provider = EmailProvider.SENDGRID;
  apiKey: string;
}
