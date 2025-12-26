import { EmailModule } from './email.module';
import { EmailService } from './email.service';
import { MockFactory } from 'mockingbird';
import { SmtpConfigFixture } from '../../test/fixtures';
import { Test } from '@nestjs/testing';

describe('EmailModule', () => {
  describe('Email Provider', () => {
    describe('register', () => {
      it('Email Service should be defined', async () => {
        const emailConfig = MockFactory(SmtpConfigFixture).one().withProvider();

        const module = await Test.createTestingModule({
          imports: [EmailModule.register(emailConfig)],
        }).compile();

        const service = module.get<EmailService>(EmailService);
        expect(service).toBeDefined();
      });

      it('Email Service should be defined (global defined)', async () => {
        const emailConfig = MockFactory(SmtpConfigFixture)
          .mutate({
            isGlobal: true,
          })
          .one()
          .withProvider();
        const module = await Test.createTestingModule({
          imports: [EmailModule.register(emailConfig)],
        }).compile();

        const service = module.get<EmailService>(EmailService);
        expect(service).toBeDefined();
      });
    });

    describe('registerAsync', () => {
      it('Email Service should be defined', async () => {
        const emailConfig = MockFactory(SmtpConfigFixture).one().withProvider();
        const module = await Test.createTestingModule({
          imports: [
            EmailModule.registerAsync({
              provider: emailConfig.provider,
              isGlobal: false,
              useFactory: () => emailConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<EmailService>(EmailService);
        expect(service).toBeDefined();
      });

      it('Email Service should be defined(with default global config)', async () => {
        const emailConfig = MockFactory(SmtpConfigFixture).one().withProvider();
        const module = await Test.createTestingModule({
          imports: [
            EmailModule.registerAsync({
              provider: emailConfig.provider,
              useFactory: () => emailConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<EmailService>(EmailService);
        expect(service).toBeDefined();
      });

      it('Email Service should be defined (global defined)', async () => {
        const emailConfig = MockFactory(SmtpConfigFixture).one().withProvider();
        const module = await Test.createTestingModule({
          imports: [
            EmailModule.registerAsync({
              provider: emailConfig.provider,
              isGlobal: true,
              useFactory: () => emailConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<EmailService>(EmailService);
        expect(service).toBeDefined();
      });
    });
  });

  it('should throw an error when given an invalid provider', () => {
    const emailConfig = MockFactory(SmtpConfigFixture)
      .mutate({
        provider: undefined,
      })
      .one();
    expect(() => {
      EmailModule.register(emailConfig);
    }).toThrow('Invalid email provider');
  });
});
