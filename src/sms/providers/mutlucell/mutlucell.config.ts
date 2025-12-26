import { SmsConfig } from '../../config';

export const MUTLUCELL_CONFIG_KEY = 'MutlucellConfig';

export class MutlucellConfig extends SmsConfig {
  username: string;
  password: string;
  originator: string;
  apiUrl?: string;
}
