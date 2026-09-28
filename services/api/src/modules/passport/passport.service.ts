import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PassportService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getPublicPassport(passportCode: string) {
    const cleanCode = passportCode.trim();

    if (!cleanCode) {
      throw new NotFoundException(
        'Passport not found',
      );
    }

    const passport =
      await this.prisma.ewastePassport.findUnique({
        where: {
          passportCode: cleanCode,
        },
        include: {
          lot: {
            include: {
              materialCategory: true,
              traceabilityEvents: {
                orderBy: {
                  timestamp: 'asc',
                },
                select: {
                  eventType: true,
                  timestamp: true,
                  metadata: true,
                },
              },
              collector: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!passport || !passport.isPublic) {
      throw new NotFoundException(
        'Public passport not found',
      );
    }

    return {
  passport: {
    passportCode: passport.passportCode,
    publicToken: passport.publicToken,
    currentStage: passport.currentStage,
    finalOutcome: passport.finalOutcome,
    createdAt: passport.createdAt,
    updatedAt: passport.updatedAt,
  },

      item: {
        lotReferenceId:
          passport.lot.referenceId,
        category:
          passport.lot.materialCategory.name,
        description:
          passport.lot.description,
        approximateWeight:
          passport.lot.approximateWeight,
        collectionTimestamp:
          passport.lot.collectionTimestamp,
      },

      collector: {
        name:
          passport.lot.collector.user.name ??
          'Verified Collector',
      },

      traceability:
        passport.lot.traceabilityEvents.map(
          (event) => ({
            eventType: event.eventType,
            timestamp: event.timestamp,
            metadata: event.metadata,
          }),
        ),
    };
  }

  async getPassportByToken(
    publicToken: string,
  ) {
    const cleanToken = publicToken.trim();

    if (!cleanToken) {
      throw new NotFoundException(
        'Passport not found',
      );
    }

    const passport =
      await this.prisma.ewastePassport.findUnique({
        where: {
          publicToken: cleanToken,
        },
        select: {
          passportCode: true,
          isPublic: true,
        },
      });

    if (!passport || !passport.isPublic) {
      throw new NotFoundException(
        'Public passport not found',
      );
    }

    return this.getPublicPassport(
      passport.passportCode,
    );
  }
}