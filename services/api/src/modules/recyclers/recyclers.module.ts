import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RecyclersController } from './recyclers.controller';
import { RecyclersService } from './recyclers.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: 900,
      },
    }),
  ],
  controllers: [RecyclersController],
  providers: [RecyclersService],
})
export class RecyclersModule {}