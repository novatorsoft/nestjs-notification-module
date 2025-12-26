import { SmsConfig } from '../../config';
import { SmsProvider } from '../../enum';

export const MUTLUCELL_CONFIG_KEY = 'MutlucellConfig';

export class MutlucellConfig extends SmsConfig {
  readonly provider = SmsProvider.MUTLUCELL;
  username: string;
  password: string;
  originator: string;
  apiUrl?: string;
}
