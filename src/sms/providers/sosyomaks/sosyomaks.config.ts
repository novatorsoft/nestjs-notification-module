import { SmsConfig } from '../../config';
import { SmsProvider } from '../../enum';

export const SOSYOMAKS_CONFIG_KEY = 'SosyomaksConfig';

export class SosyomaksConfig extends SmsConfig {
  readonly provider = SmsProvider.SOSYOMAKS;
  username: string;
  password: string;
  originator: string;
  apiUrl?: string;
}
