import { ConfigType, SmsAsyncConfig } from './config';
import { DynamicModule, Module } from '@nestjs/common';
import { MUTLUCELL_CONFIG_KEY, MutlucellService } from './providers';

import { SmsProvider } from './enum';
import { SmsService } from './sms.service';

@Module({})
export class SmsModule {
  static register(config: ConfigType): DynamicModule {
    const smsModuleConfig = SmsModule.getSmsProviderModuleConfig(
      config?.provider,
    );
    return {
      module: SmsModule,
      global: config?.isGlobal ?? false,
      providers: [
        smsModuleConfig.service,
        {
          provide: smsModuleConfig.configKey,
          useValue: config,
        },
        {
          provide: SmsService,
          useClass: smsModuleConfig.service,
        },
      ],
      exports: [SmsService],
    };
  }

  static registerAsync(config: SmsAsyncConfig): DynamicModule {
    const smsModuleConfig = SmsModule.getSmsProviderModuleConfig(
      config?.provider,
    );
    return {
      module: SmsModule,
      global: config?.isGlobal ?? false,
      imports: config.imports,
      providers: [
        smsModuleConfig.service,
        {
          provide: smsModuleConfig.configKey,
          useFactory: config.useFactory,
          inject: config.inject,
        },
        {
          provide: SmsService,
          useClass: smsModuleConfig.service,
        },
      ],
      exports: [SmsService],
    };
  }

  private static getSmsProviderModuleConfig(provider: SmsProvider) {
    const smsModuleConfigs = {
      [SmsProvider.MUTLUCELL]: {
        service: MutlucellService,
        configKey: MUTLUCELL_CONFIG_KEY,
      },
    };

    const smsModuleConfig = smsModuleConfigs[provider];
    if (!smsModuleConfig) throw new Error('Invalid sms provider');

    return smsModuleConfig;
  }
}
