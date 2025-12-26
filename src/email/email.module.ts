import { DynamicModule, Module } from '@nestjs/common';
import { EmailAsyncConfig, EmailConfigType } from './config';
import { SMTP_CONFIG_KEY, SmtpService } from './providers';

import { EmailProvider } from './enum';
import { EmailService } from './email.service';

@Module({})
export class EmailModule {
  static register(config: EmailConfigType): DynamicModule {
    const emailModuleConfig = EmailModule.getEmailProviderModuleConfig(
      config?.provider,
    );
    return {
      module: EmailModule,
      global: config?.isGlobal ?? false,
      providers: [
        emailModuleConfig.service,
        {
          provide: emailModuleConfig.configKey,
          useValue: config,
        },
        {
          provide: EmailService,
          useClass: emailModuleConfig.service,
        },
      ],
      exports: [EmailService],
    };
  }

  static registerAsync(config: EmailAsyncConfig): DynamicModule {
    const emailModuleConfig = EmailModule.getEmailProviderModuleConfig(
      config?.provider,
    );
    return {
      module: EmailModule,
      global: config?.isGlobal ?? false,
      imports: config.imports,
      providers: [
        emailModuleConfig.service,
        {
          provide: emailModuleConfig.configKey,
          useFactory: config.useFactory,
          inject: config.inject,
        },
        {
          provide: EmailService,
          useClass: emailModuleConfig.service,
        },
      ],
      exports: [EmailService],
    };
  }

  private static getEmailProviderModuleConfig(provider: EmailProvider) {
    const emailModuleConfigs = {
      [EmailProvider.SMTP]: {
        service: SmtpService,
        configKey: SMTP_CONFIG_KEY,
      },
    };

    const emailModuleConfig = emailModuleConfigs[provider];
    if (!emailModuleConfig) throw new Error('Invalid email provider');

    return emailModuleConfig;
  }
}
