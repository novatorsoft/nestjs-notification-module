import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { MutlucellConfig } from '../providers';
import { SmsConfig } from './sms.config';

export type SmsConfigType = MutlucellConfig;

export type SmsAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<
    FactoryProvider<Omit<SmsConfigType, 'provider' | 'isGlobal'>>,
    'useFactory' | 'inject'
  > &
  SmsConfig;
