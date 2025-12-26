import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { MutlucellConfig } from '../providers';
import { SmsConfig } from './sms.config';

export type ConfigType = MutlucellConfig;

export type SmsAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<
    FactoryProvider<Omit<ConfigType, 'provider' | 'isGlobal'>>,
    'useFactory' | 'inject'
  > &
  SmsConfig;
