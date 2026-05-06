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
    const hasTurkishChars = /[şğıöüçİŞĞÜÖÇ]/.test(sendSmsArgs.message);

    return this.sendRequestAsync({
      UserName: this.sosyomaksConfig.username,
      PassWord: this.sosyomaksConfig.password,
      Action: hasTurkishChars ? '12' : '0',
      Mesgbody: sendSmsArgs.message,
      Numbers: sendSmsArgs.phoneNumber.replace(/^0+/, ''),
      Originator: this.sosyomaksConfig.originator,
    });
  }

  private async sendRequestAsync(
    sosyomaksRequest: SosyomaksRequest,
  ): Promise<boolean> {
    try {
      const xml = parse(
        'SingleTextSMS',
        { ...sosyomaksRequest, SDate: '', ExDate: '' },
        {
          declaration: { encoding: 'UTF-8' },
        },
      ).replaceAll(/<\?xml[^?]*\?>\s*/g, '');
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
