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

    const hasTurkishChars = /[şğıöüçİŞĞÜÖÇ]/.test(sendSmsArgs.message);

    const sosyomaksRequest: SosyomaksRequest = {
      UserName: this.sosyomaksConfig.username,
      PassWord: this.sosyomaksConfig.password,
      Action: hasTurkishChars ? '12' : '0',
      Mesgbody: sendSmsArgs.message,
      Numbers: sendSmsArgs.phoneNumber.replace(/^0+/, ''),
      Originator: this.sosyomaksConfig.originator,
      SDate: '',
      ExDate: '',
    };
    let xml = parse('SingleTextSMS', sosyomaksRequest, {
      declaration: { encoding: 'UTF-8' },
    });
    xml = xml.replaceAll(/<\?xml[^?]*\?>\s*/g, '');
    return this.sendRequestAsync(xml);
  }

  private async sendRequestAsync(xml: string): Promise<boolean> {
    try {
      await fetch(this.sosyomaksConfig?.apiUrl ?? this.defaultApiUrl, {
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type': 'text/xml',
        },
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
