import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';

@Module({
  imports: [PrismaModule],
  controllers: [PassportController],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}