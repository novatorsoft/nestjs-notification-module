import { MockFactory } from 'mockingbird';
import { MutlucellConfigFixture } from '../../test/fixtures';
import { SmsModule } from './sms.module';
import { SmsService } from './sms.service';
import { Test } from '@nestjs/testing';

describe('SmsModule', () => {
  describe('SMS Provider', () => {
    describe('register', () => {
      it('SMS Service should be defined', async () => {
        const smsConfig = MockFactory(MutlucellConfigFixture)
          .one()
          .withProvider();

        const module = await Test.createTestingModule({
          imports: [SmsModule.register(smsConfig)],
        }).compile();

        const service = module.get<SmsService>(SmsService);
        expect(service).toBeDefined();
      });

      it('SMS Service should be defined (global defined)', async () => {
        const smsConfig = MockFactory(MutlucellConfigFixture)
          .mutate({
            isGlobal: true,
          })
          .one()
          .withProvider();
        const module = await Test.createTestingModule({
          imports: [SmsModule.register(smsConfig)],
        }).compile();

        const service = module.get<SmsService>(SmsService);
        expect(service).toBeDefined();
      });
    });

    describe('registerAsync', () => {
      it('SMS Service should be defined', async () => {
        const smsConfig = MockFactory(MutlucellConfigFixture)
          .one()
          .withProvider();
        const module = await Test.createTestingModule({
          imports: [
            SmsModule.registerAsync({
              provider: smsConfig.provider,
              isGlobal: false,
              useFactory: () => smsConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<SmsService>(SmsService);
        expect(service).toBeDefined();
      });

      it('SMS Service should be defined(with default global config)', async () => {
        const smsConfig = MockFactory(MutlucellConfigFixture)
          .one()
          .withProvider();
        const module = await Test.createTestingModule({
          imports: [
            SmsModule.registerAsync({
              provider: smsConfig.provider,
              useFactory: () => smsConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<SmsService>(SmsService);
        expect(service).toBeDefined();
      });

      it('SMS Service should be defined (global defined)', async () => {
        const smsConfig = MockFactory(MutlucellConfigFixture)
          .one()
          .withProvider();
        const module = await Test.createTestingModule({
          imports: [
            SmsModule.registerAsync({
              provider: smsConfig.provider,
              isGlobal: true,
              useFactory: () => smsConfig,
              inject: [],
            }),
          ],
        }).compile();

        const service = module.get<SmsService>(SmsService);
        expect(service).toBeDefined();
      });
    });
  });

  it('should throw an error when given an invalid provider', () => {
    const smsConfig = MockFactory(MutlucellConfigFixture)
      .mutate({
        provider: undefined,
      })
      .one();
    expect(() => {
      SmsModule.register(smsConfig);
    }).toThrow('Invalid sms provider');
  });
});
