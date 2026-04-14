import { Mock } from 'mockingbird';
import { SosyomaksConfig } from '../../../../src/sms/providers';
import { SmsProvider } from '../../../../src/sms';
import faker from 'faker';

export class SosyomaksConfigFixture extends SosyomaksConfig {
  @Mock(SmsProvider.SOSYOMAKS)
  declare provider: SmsProvider;

  @Mock((faker) => faker.lorem.word())
  declare username: string;

  @Mock((faker) => faker.finance.amount())
  declare password: string;

  @Mock((faker) => faker.finance.amount())
  declare originator: string;

  withApiUrl(): this {
    this.apiUrl = faker.internet.url();
    return this;
  }

  withProvider(): this {
    this.provider = SmsProvider.SOSYOMAKS;
    return this;
  }
}
