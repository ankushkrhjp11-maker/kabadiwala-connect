import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // COLLECTORS
  // =========================================================

  async getAllCollectors() {
    return this.prisma.user.findMany({
      where: {
        role: 'COLLECTOR',
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        businessRole: true,
        preferredLanguage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,

        collectorProfile: {
          select: {
            id: true,
            address: true,
            locationDescription: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  // =========================================================
  // LOTS
  // =========================================================

  async getAllLots() {
    // -------------------------------------------------------
    // DEBUG: Check total database lots
    // -------------------------------------------------------

    const count = await this.prisma.lot.count();

    console.log(
      '==========================================',
    );

    console.log(
      `[ADMIN LOTS] Database lot count: ${count}`,
    );

    console.log(
      '==========================================',
    );

    // -------------------------------------------------------
    // Fetch lots with:
    // 1. Material category
    // 2. Collector + user
    // 3. E-Waste Passport
    // -------------------------------------------------------

    const lots = await this.prisma.lot.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        // ---------------------------------------------------
        // MATERIAL CATEGORY
        // ---------------------------------------------------

        materialCategory: true,

        // ---------------------------------------------------
        // COLLECTOR
        // ---------------------------------------------------

        collector: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isActive: true,
              },
            },
          },
        },

        // ---------------------------------------------------
        // E-WASTE PASSPORT
        // ---------------------------------------------------

        passport: {
          select: {
            passportCode: true,
            publicToken: true,
            isPublic: true,
            currentStage: true,
            finalOutcome: true,
          },
        },
      },
    });

    // -------------------------------------------------------
    // DEBUG: Returned rows
    // -------------------------------------------------------

    console.log(
      `[ADMIN LOTS] Returned rows: ${lots.length}`,
    );

    // -------------------------------------------------------
    // DEBUG: Latest lot
    // -------------------------------------------------------

    if (lots.length > 0) {
      console.log(
        '[ADMIN LOTS] Latest lot:',
        {
          id: lots[0].id,
          referenceId: lots[0].referenceId,
          status: lots[0].status,
          passport: lots[0].passport
            ? {
                passportCode:
                  lots[0].passport.passportCode,

                isPublic:
                  lots[0].passport.isPublic,

                currentStage:
                  lots[0].passport.currentStage,

                finalOutcome:
                  lots[0].passport.finalOutcome,
              }
            : null,
        },
      );
    }

    return lots;
  }

  // =========================================================
  // PRICE BOARD
  // =========================================================

  async getAllPriceBoard() {
    return this.prisma.priceBoard.findMany({
      orderBy: [
        {
          effectiveDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],

      include: {
        materialCategory: true,
      },
    });
  }

  // =========================================================
  // PAYMENTS / TRANSACTIONS
  // =========================================================

  async getAllPayments() {
    return this.prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        collectorProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isActive: true,
              },
            },
          },
        },

        recycler: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isActive: true,
              },
            },
          },
        },

        lot: {
          select: {
            id: true,
            referenceId: true,
            status: true,

            materialCategory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // =========================================================
  // RECYCLERS
  // =========================================================

  async getPendingRecyclers() {
    return this.prisma.recycler.findMany({
      where: {
        authorizationStatus: 'PENDING',
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });
  }

  // =========================================================
  // ALL RECYCLERS
  // =========================================================

  async getAllRecyclers() {
    return this.prisma.recycler.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });
  }

  // =========================================================
  // GET SINGLE RECYCLER
  // =========================================================

  async getRecycler(id: string) {
    const recycler =
      await this.prisma.recycler.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
      });

    if (!recycler) {
      throw new NotFoundException(
        'Recycler profile not found',
      );
    }

    return recycler;
  }

  // =========================================================
  // VERIFY RECYCLER
  // =========================================================

  async verifyRecycler(id: string) {
    const recycler =
      await this.prisma.recycler.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          authorizationStatus: true,
        },
      });

    if (!recycler) {
      throw new NotFoundException(
        'Recycler profile not found',
      );
    }

    if (
      recycler.authorizationStatus === 'VERIFIED'
    ) {
      return {
        message: 'Recycler is already verified',

        recycler:
          await this.getRecycler(id),
      };
    }

    if (
      recycler.authorizationStatus !== 'PENDING'
    ) {
      throw new BadRequestException(
        `Recycler cannot be verified from ${recycler.authorizationStatus} status`,
      );
    }

    const updated =
      await this.prisma.recycler.update({
        where: {
          id,
        },

        data: {
          authorizationStatus: 'VERIFIED',
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

    return {
      message:
        'Recycler verified successfully',

      recycler: updated,
    };
  }

  // =========================================================
  // REJECT RECYCLER
  // =========================================================

  async rejectRecycler(id: string) {
    const recycler =
      await this.prisma.recycler.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          authorizationStatus: true,
        },
      });

    if (!recycler) {
      throw new NotFoundException(
        'Recycler profile not found',
      );
    }

    if (
      recycler.authorizationStatus === 'VERIFIED'
    ) {
      throw new BadRequestException(
        'A verified recycler cannot be rejected directly',
      );
    }

    const updated =
      await this.prisma.recycler.update({
        where: {
          id,
        },

        data: {
          authorizationStatus: 'REJECTED',
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

    return {
      message:
        'Recycler rejected successfully',

      recycler: updated,
    };
  }
}