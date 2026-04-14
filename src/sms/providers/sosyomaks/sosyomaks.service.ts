import { Inject, Injectable } from '@nestjs/common';
import { SendSmsArgs } from 'src/sms/dto';
import { SmsService } from '../../sms.service';
import { SOSYOMAKS_CONFIG_KEY, SosyomaksConfig } from './sosyomaks.config';
import { SosyomaksRequest } from './dto';
import { parse } from 'js2xmlparser';

@Injectable()
export class SosyomaksService extends SmsService {
  private readonly defaultApiUrl = 'https://www.sosyomaks.com/api/send/post';

  constructor(
    @Inject(SOSYOMAKS_CONFIG_KEY)
    private readonly sosyomaksConfig: SosyomaksConfig,
  ) {
    super();
  }

  async sendAsync(sendSmsArgs: SendSmsArgs): Promise<boolean> {
    if (sendSmsArgs.message.trim().length === 0)
      throw new Error('Message cannot be empty');

    const sosyomaksRequest = new SosyomaksRequest(
      sendSmsArgs.message,
      sendSmsArgs.phoneNumber.replace(/^0+/, ''),
      this.sosyomaksConfig.username,
      this.sosyomaksConfig.password,
      this.sosyomaksConfig.originator,
    );
    const xml = parse('SingleTextSMS', sosyomaksRequest, {
      declaration: { encoding: 'UTF-8' },
    });
    return this.sendRequestAsync(xml);
  }

  private async sendRequestAsync(xml: string): Promise<boolean> {
    try {
      await fetch(this.sosyomaksConfig?.apiUrl ?? this.defaultApiUrl, {
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type': 'application/xml',
        },
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
