import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { SendgridConfig, SmtpConfig } from '../providers';

import { EmailConfig } from './email.config';

export type EmailConfigType = SmtpConfig | SendgridConfig;

export type EmailAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<
    FactoryProvider<Omit<EmailConfigType, 'provider' | 'isGlobal'>>,
    'useFactory' | 'inject'
  > &
  EmailConfig;
