import { EmailProvider } from '../../../../src/email';
import { Mock } from 'mockingbird';
import { SmtpConfig } from '../../../../src/email/providers/smtp/smtp.config';

class SmtpAuthFixture {
  @Mock((faker) => faker.internet.email())
  declare user: string;

  @Mock((faker) => faker.internet.password())
  declare password: string;
}

export class SmtpConfigFixture extends SmtpConfig {
  @Mock(EmailProvider.SMTP)
  declare provider: EmailProvider.SMTP;

  @Mock((faker) => faker.internet.url())
  declare host: string;

  @Mock(SmtpAuthFixture)
  declare auth: SmtpAuthFixture;

  @Mock((faker) => faker.internet.email())
  declare defaultFromAddress: string;

  @Mock((faker) => faker.datatype.number({ min: 1, max: 65535 }))
  declare port: number;

  @Mock((faker) => faker.datatype.boolean())
  declare secure: boolean;

  @Mock((faker) => faker.datatype.boolean())
  declare requireTLS: boolean;

  withProvider(): this {
    this.provider = EmailProvider.SMTP;
    return this;
  }
}
