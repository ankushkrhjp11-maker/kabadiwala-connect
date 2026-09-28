import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateLotDto } from './dto/create-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE LOT
  // =========================================================

  async create(
    collectorUserId: string,
    dto: CreateLotDto,
  ) {
    const collector =
      await this.prisma.collectorProfile.findUnique({
        where: {
          userId: collectorUserId,
        },
      });

    if (!collector) {
      throw new NotFoundException(
        'Collector profile not found. Create collector profile first.',
      );
    }

    const category =
      await this.prisma.materialCategory.findFirst({
        where: {
          id: dto.materialCategoryId,
          isActive: true,
        },
      });

    if (!category) {
      throw new BadRequestException(
        'Invalid material category',
      );
    }

    if (
      dto.estimatedValueLow !== undefined &&
      dto.estimatedValueHigh !== undefined &&
      dto.estimatedValueLow >
        dto.estimatedValueHigh
    ) {
      throw new BadRequestException(
        'Estimated minimum value cannot be greater than maximum value',
      );
    }

    const referenceId =
      await this.generateReferenceId();

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // -------------------------------------------------
          // 1. Create collection lot
          // -------------------------------------------------

          const lot = await tx.lot.create({
            data: {
              referenceId,
              collectorId: collector.id,
              materialCategoryId:
                dto.materialCategoryId,
              description: dto.description,
              imageReference:
                dto.imageReference,
              approximateWeight:
                dto.approximateWeight,
              estimatedValueLow:
                dto.estimatedValueLow,
              estimatedValueHigh:
                dto.estimatedValueHigh,
              valuationConfidence:
                dto.valuationConfidence,
              collectionTimestamp: new Date(
                dto.collectionTimestamp,
              ),
              latitude: dto.latitude,
              longitude: dto.longitude,
              status: 'AVAILABLE',
            },
          });

          // -------------------------------------------------
          // 2. Create E-Waste Passport
          // -------------------------------------------------

          const passportCode =
            `EW-${referenceId}`;

          const publicToken =
            randomBytes(24).toString(
              'base64url',
            );

          await tx.ewastePassport.create({
            data: {
              passportCode,
              lotId: lot.id,
              publicToken,
              isPublic: true,
              currentStage: 'COLLECTED',
            },
          });

          // -------------------------------------------------
          // 3. First traceability event
          // -------------------------------------------------

          await tx.traceabilityEvent.create({
            data: {
              lotId: lot.id,
              eventType: 'LOT_CREATED',
              actorUserId: collectorUserId,
              timestamp: new Date(),
              latitude: dto.latitude,
              longitude: dto.longitude,
              metadata: {
                referenceId,
                passportCode,
              },
            },
          });

          // -------------------------------------------------
          // 4. Return lot with Passport
          // -------------------------------------------------

          return tx.lot.findUnique({
            where: {
              id: lot.id,
            },
            include: {
              materialCategory: true,
              passport: true,
            },
          });
        },
      );

    if (!result) {
      throw new BadRequestException(
        'Unable to create collection lot',
      );
    }

    return result;
  }

  // =========================================================
  // CONFIRM HANDOVER
  // =========================================================

  async confirmHandover(
    lotId: string,
    actorUserId: string,
  ) {
    // -------------------------------------------------------
    // 1. Find lot
    // -------------------------------------------------------

    const lot =
      await this.prisma.lot.findUnique({
        where: {
          id: lotId,
        },
        include: {
          passport: true,
          materialCategory: true,
        },
      });

    if (!lot) {
      throw new NotFoundException(
        'Lot not found',
      );
    }

    // -------------------------------------------------------
    // 2. Passport must exist
    // -------------------------------------------------------

    if (!lot.passport) {
      throw new BadRequestException(
        'E-Waste Passport is not available for this lot',
      );
    }

    // -------------------------------------------------------
    // 3. Lot status validation
    // -------------------------------------------------------

    if (
      lot.status !== 'AVAILABLE' &&
      lot.status !== 'PICKUP_SCHEDULED'
    ) {
      throw new BadRequestException(
        `Lot cannot be handed over from ${lot.status} status`,
      );
    }

    // -------------------------------------------------------
    // Store nullable values before transaction
    // -------------------------------------------------------

    const passportCode =
      lot.passport.passportCode;

    const materialCategoryName =
      lot.materialCategory.name;

    // -------------------------------------------------------
    // 4. Transaction
    // -------------------------------------------------------

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // -------------------------------------------------
          // Update Lot status
          // -------------------------------------------------

          await tx.lot.update({
            where: {
              id: lotId,
            },

            data: {
              status: 'HANDED_OVER',
            },
          });

          // -------------------------------------------------
          // Update Passport stage
          // -------------------------------------------------

          const updatedPassport =
            await tx.ewastePassport.update({
              where: {
                lotId,
              },

              data: {
                currentStage:
                  'HANDOVER_CONFIRMED',
              },
            });

          // -------------------------------------------------
          // Create traceability milestone
          // -------------------------------------------------

          const traceabilityEvent =
            await tx.traceabilityEvent.create({
              data: {
                lotId,

                eventType:
                  'HANDOVER_CONFIRMED',

                actorUserId,

                timestamp: new Date(),

                metadata: {
                  lotStatus:
                    'HANDED_OVER',

                  passportCode,

                  materialCategory:
                    materialCategoryName,
                },
              },
            });

          // -------------------------------------------------
          // Fetch final lot state
          // -------------------------------------------------

          const updatedLot =
            await tx.lot.findUnique({
              where: {
                id: lotId,
              },

              include: {
                materialCategory: true,
                passport: true,
              },
            });

          return {
            lot: updatedLot,
            passport: updatedPassport,
            traceabilityEvent,
          };
        },
      );

    // -------------------------------------------------------
    // Safety check
    // -------------------------------------------------------

    if (!result.lot) {
      throw new BadRequestException(
        'Unable to update lot after handover',
      );
    }

    // -------------------------------------------------------
    // Final response
    // -------------------------------------------------------

    return {
      message:
        'E-waste handover confirmed successfully',

      lot: result.lot,

      passport: result.passport,

      traceabilityEvent:
        result.traceabilityEvent,
    };
  }

  // =========================================================
  // CONFIRM RECEIVED BY RECYCLER
  // =========================================================

  async confirmRecyclerReceived(
    lotId: string,
    actorUserId: string,
  ) {
    // -------------------------------------------------------
    // 1. Find lot with passport + material
    // -------------------------------------------------------

    const lot =
      await this.prisma.lot.findUnique({
        where: {
          id: lotId,
        },
        include: {
          passport: true,
          materialCategory: true,
        },
      });

    if (!lot) {
      throw new NotFoundException(
        'Lot not found',
      );
    }

    // -------------------------------------------------------
    // 2. Passport must exist
    // -------------------------------------------------------

    if (!lot.passport) {
      throw new BadRequestException(
        'E-Waste Passport is not available for this lot',
      );
    }

    // -------------------------------------------------------
    // 3. Lot must already be handed over
    // -------------------------------------------------------

    if (lot.status !== 'HANDED_OVER') {
      throw new BadRequestException(
        `Lot cannot be received by recycler from ${lot.status} status`,
      );
    }

    // -------------------------------------------------------
    // 4. Prevent duplicate recycler receipt
    // -------------------------------------------------------

    if (
      lot.passport.currentStage ===
      'RECEIVED_BY_RECYCLER'
    ) {
      throw new BadRequestException(
        'Lot has already been marked as received by recycler',
      );
    }

    // -------------------------------------------------------
    // Store values before transaction
    // -------------------------------------------------------

    const passportCode =
      lot.passport.passportCode;

    const materialCategoryName =
      lot.materialCategory.name;

    // -------------------------------------------------------
    // 5. Transaction
    // -------------------------------------------------------

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // -------------------------------------------------
          // Update Passport stage
          // -------------------------------------------------

          const updatedPassport =
            await tx.ewastePassport.update({
              where: {
                lotId,
              },

              data: {
                currentStage:
                  'RECEIVED_BY_RECYCLER',
              },
            });

          // -------------------------------------------------
          // Create traceability milestone
          // -------------------------------------------------

          const traceabilityEvent =
            await tx.traceabilityEvent.create({
              data: {
                lotId,

                eventType:
                  'RECEIVED_BY_RECYCLER',

                actorUserId,

                timestamp: new Date(),

                metadata: {
                  lotStatus:
                    'HANDED_OVER',

                  passportCode,

                  materialCategory:
                    materialCategoryName,

                  milestone:
                    'RECEIVED_BY_RECYCLER',
                },
              },
            });

          // -------------------------------------------------
          // Fetch final lot + passport
          // -------------------------------------------------

          const updatedLot =
            await tx.lot.findUnique({
              where: {
                id: lotId,
              },

              include: {
                materialCategory: true,
                passport: true,
              },
            });

          return {
            lot: updatedLot,
            passport: updatedPassport,
            traceabilityEvent,
          };
        },
      );

    // -------------------------------------------------------
    // Safety check
    // -------------------------------------------------------

    if (!result.lot) {
      throw new BadRequestException(
        'Unable to update lot after recycler receipt',
      );
    }

    // -------------------------------------------------------
    // Final response
    // -------------------------------------------------------

    return {
      message:
        'E-waste received by recycler successfully',

      lot: result.lot,

      passport: result.passport,

      traceabilityEvent:
        result.traceabilityEvent,
    };
  }

  // =========================================================
  // GENERATE LOT REFERENCE ID
  // =========================================================

  private async generateReferenceId(): Promise<string> {
    const year =
      new Date().getFullYear();

    const lastLot =
      await this.prisma.lot.findFirst({
        orderBy: {
          createdAt: 'desc',
        },

        select: {
          referenceId: true,
        },
      });

    let nextNumber = 1;

    if (lastLot?.referenceId) {
      const match =
        lastLot.referenceId.match(
          /KC-\d{4}-(\d+)$/,
        );

      if (match) {
        nextNumber =
          Number(match[1]) + 1;
      }
    }

    return `KC-${year}-${String(
      nextNumber,
    ).padStart(5, '0')}`;
  }
}