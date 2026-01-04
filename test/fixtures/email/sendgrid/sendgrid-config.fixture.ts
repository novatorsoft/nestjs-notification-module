import { EmailProvider } from '../../../../src/email';
import { Mock } from 'mockingbird';
import { SendgridConfig } from '../../../../src/email/providers/sendgrid/sendgrid.config';

export class SendgridConfigFixture extends SendgridConfig {
  @Mock(EmailProvider.SENDGRID)
  declare provider: EmailProvider.SENDGRID;

  @Mock((faker) => faker.datatype.uuid())
  declare apiKey: string;

  @Mock((faker) => faker.internet.email())
  declare defaultFromAddress: string;

  withProvider(): this {
    this.provider = EmailProvider.SENDGRID;
    return this;
  }
}
