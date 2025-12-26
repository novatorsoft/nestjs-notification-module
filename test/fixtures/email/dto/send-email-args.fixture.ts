import { Mock } from 'mockingbird';
import { SendEmailArgs } from '../../../../src/email/dto';
import faker from 'faker';

export class SendEmailArgsFixture extends SendEmailArgs {
  @Mock((faker) => faker.internet.email())
  declare to: string;

  @Mock((faker) => faker.lorem.sentence())
  declare subject: string;

  @Mock((faker) => faker.lorem.sentence())
  declare content: string;

  withFrom(): this {
    this.from = faker.internet.email();
    return this;
  }

  withCc(): this {
    this.cc = [faker.internet.email(), faker.internet.email()];
    return this;
  }

  withBcc(): this {
    this.bcc = [faker.internet.email()];
    return this;
  }

  withAttachments(): this {
    this.attachments = [
      {
        content: 'base64content',
        filename: 'test.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
        encoding: 'base64',
      },
      {
        content: 'base64content2',
        filename: 'test2.jpg',
        type: 'image/jpeg',
        encoding: 'base64',
      },
    ];
    return this;
  }

  withMultipleRecipients(): this {
    this.to = [
      faker.internet.email(),
      faker.internet.email(),
    ] as unknown as string;
    return this;
  }
}
