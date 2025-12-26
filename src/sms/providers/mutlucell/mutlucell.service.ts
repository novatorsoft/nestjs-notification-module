import { Inject, Injectable } from '@nestjs/common';
import { SendSmsArgs } from 'src/sms/dto';
import { SmsService } from '../../sms.service';
import { MUTLUCELL_CONFIG_KEY, MutlucellConfig } from './mutlucell.config';
import { MutlucellRequest } from './dto';
import { parse } from 'js2xmlparser';

@Injectable()
export class MutlucellService extends SmsService {
  private readonly defaultApiUrl =
    'https://smsgw.mutlucell.com/smsgw-ws/sndblkex';

  constructor(
    @Inject(MUTLUCELL_CONFIG_KEY)
    private readonly mutlucellConfig: MutlucellConfig,
  ) {
    super();
  }

  async sendAsync(sendSmsArgs: SendSmsArgs): Promise<boolean> {
    if (sendSmsArgs.message.trim().length === 0)
      throw new Error('Message cannot be empty');

    const mutlucellRequest = new MutlucellRequest(
      sendSmsArgs.message,
      `${sendSmsArgs.countryCode}${sendSmsArgs.phoneNumber}`,
      this.mutlucellConfig.username,
      this.mutlucellConfig.password,
      this.mutlucellConfig.originator,
    );
    const xml = parse('smspack', mutlucellRequest, {
      declaration: { encoding: 'UTF-8' },
    });
    return this.sendRequestAsync(xml);
  }

  private async sendRequestAsync(xml: string): Promise<boolean> {
    try {
      await fetch(this.mutlucellConfig?.apiUrl ?? this.defaultApiUrl, {
        method: 'POST',
        body: xml,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
