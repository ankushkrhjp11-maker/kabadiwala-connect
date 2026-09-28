import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { LotsModule } from './modules/lots/lots.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { OffersModule } from './modules/offers/offers.module';
import { PassportModule } from './modules/passport/passport.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PricesModule } from './modules/prices/prices.module';
import { RecyclersModule } from './modules/recyclers/recyclers.module';
import { SafetyModule } from './modules/safety/safety.module';
import { TraceabilityModule } from './modules/traceability/traceability.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const nodeEnv = config.NODE_ENV;

  if (
    nodeEnv &&
    !['development', 'test', 'production'].includes(
      String(nodeEnv),
    )
  ) {
    throw new Error(
      'NODE_ENV must be development, test, or production.',
    );
  }

  const apiPort = config.API_PORT;

  if (apiPort && !/^\d+$/.test(String(apiPort))) {
    throw new Error('API_PORT must be a valid integer.');
  }

  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '../../.env',
      validate: validateEnvironment,
    }),

    PrismaModule,

    // Core modules
    HealthModule,
    AuthModule,
    AdminModule,
    UsersModule,

    // Material & pricing
    MaterialsModule,
    PricesModule,

    // Lot, Passport & marketplace
    LotsModule,
    PassportModule,
    RecyclersModule,
    OffersModule,

    // Trust & transaction
    TraceabilityModule,
    PaymentsModule,

    // Safety
    SafetyModule,

    // AI photo validation
    AiModule,
  ],
})
export class AppModule {}