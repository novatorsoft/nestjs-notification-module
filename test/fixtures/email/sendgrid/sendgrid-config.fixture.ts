import { EmailProvider } from '../../../../src/email';
import { Mock } from 'mockingbird';
import { SendgridConfig } from '../../../../src/email/providers/sendgrid/sendgrid.config';
import faker from 'faker';

export class SendgridConfigFixture extends SendgridConfig {
  @Mock(EmailProvider.SENDGRID)
  declare provider: EmailProvider;

  @Mock((faker) => faker.datatype.uuid())
  declare apiKey: string;

  @Mock((faker) => faker.internet.email())
  declare defaultFromAddress: string;

  withProvider(): this {
    this.provider = EmailProvider.SENDGRID;
    return this;
  }
}
