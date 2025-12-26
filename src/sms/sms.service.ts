import { SendSmsArgs } from './dto';

export abstract class SmsService {
  abstract sendAsync(sendSmsArgs: SendSmsArgs): Promise<boolean>;
}
