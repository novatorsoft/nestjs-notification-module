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
      declaration: false,
    });
    return this.sendRequestAsync(xml);
  }

  private async sendRequestAsync(xml: string): Promise<boolean> {
    try {
      const response = await fetch(
        this.sosyomaksConfig?.apiUrl ?? this.defaultApiUrl,
        {
          method: 'POST',
          body: xml,
          headers: {
            'Content-Type': 'text/xml',
          },
        },
      );
      const result = await response.text();
      
      if (result.startsWith('ID:')) {
        this.logger.log(`SMS sent successfully: ${result}`);
        return true;
      } else {
        this.logger.error(`SMS send failed with error code: ${result}`);
        return false;
      }
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
