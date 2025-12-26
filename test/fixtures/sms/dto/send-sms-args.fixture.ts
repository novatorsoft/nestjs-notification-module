import { Mock } from 'mockingbird';
import { SendSmsArgs } from '../../../../src/sms/dto';

export class SendSmsArgsFixture extends SendSmsArgs {
  @Mock((faker) => faker.datatype.number({ min: 1, max: 999 }))
  declare countryCode: string;

  @Mock((faker) => faker.phone.phoneNumberFormat(1))
  declare phoneNumber: string;

  @Mock((faker) => faker.lorem.sentence())
  declare message: string;

  withEmptyMessage(): this {
    this.message = '';
    return this;
  }
}
