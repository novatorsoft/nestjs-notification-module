import { EmailProvider } from '../enum';

export class EmailConfig {
  provider: EmailProvider;
  isGlobal?: boolean;
  defaultFromAddress?: string;
}
