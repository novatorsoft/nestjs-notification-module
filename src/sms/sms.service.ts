import { Logger } from '@nestjs/common';
import { SendSmsArgs } from './dto';

export abstract class SmsService {
  protected readonly logger = new Logger(SmsService.name);
  abstract sendAsync(sendSmsArgs: SendSmsArgs): Promise<boolean>;
}
