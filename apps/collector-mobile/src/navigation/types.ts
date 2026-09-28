export type AppRoute =
  | 'splash'
  | 'language'
  | 'login'
  | 'otp'
  | 'roleSelection'
  | 'profileSetup'
  | 'register'
  | 'dashboard'
  | 'recyclerDashboard'
  | 'traderDashboard'
  | 'manufacturerDashboard'
  | 'createLot'
  | 'myLots'
  | 'earnings'
  | 'safety'
  | 'profile';

import type { SupportedLocale } from '../../../../packages/types/src';

export type AppLanguage = SupportedLocale;

export type BusinessRole =
  | 'Collector'
  | 'Recycler'
  | 'Trader'
  | 'Manufacturer';