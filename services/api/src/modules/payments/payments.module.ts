import { Module } from '@nestjs/common';

/** Payment workflows are intentionally deferred; this preserves the domain boundary. */
@Module({})
export class PaymentsModule {}
