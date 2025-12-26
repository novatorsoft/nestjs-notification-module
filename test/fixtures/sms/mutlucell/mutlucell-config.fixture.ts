import { Mock } from 'mockingbird';
import { MutlucellConfig } from '../../../../src/sms/provider/mutlucell';
import faker from 'faker';

export class MutlucellConfigFixture extends MutlucellConfig {
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
}
