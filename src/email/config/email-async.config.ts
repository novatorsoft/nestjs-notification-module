import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { EmailConfig } from './email.config';
import { SmtpConfig } from '../providers';

export type EmailConfigType = SmtpConfig;

export type EmailAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<
    FactoryProvider<Omit<EmailConfigType, 'provider' | 'isGlobal'>>,
    'useFactory' | 'inject'
  > &
  EmailConfig;
