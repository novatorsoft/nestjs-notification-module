import { SmsConfig } from '../../config';

export class MutlucellConfig extends SmsConfig {
  username: string;
  password: string;
  originator: string;
  apiUrl?: string;
}
