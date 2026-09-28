import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<{ status: string; service: string; database: string }> {
    const database = (await this.prisma.isHealthy()) ? 'connected' : 'unavailable';

    return {
      status: 'ok',
      service: 'kabadiwala-connect-api',
      database,
    };
  }
}
