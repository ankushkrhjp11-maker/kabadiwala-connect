import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollectorProfile(userId: string) {
    const profile = await this.prisma.collectorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            email: true,
            dateOfBirth: true,
            businessRole: true,
            profileImageReference: true,
            role: true,
            preferredLanguage: true,
            isActive: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Collector profile not found');
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        dateOfBirth: true,
        businessRole: true,
        profileImageReference: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        collectorProfile: true,
        recycler: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMyProfile(
    userId: string,
    data: {
      name: string;
      email: string;
      dateOfBirth: string;
      businessRole?:
        | 'RECYCLER'
        | 'TRADER'
        | 'MANUFACTURER';
      profileImageReference?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const name = data.name.trim();

    if (name.length < 2) {
      throw new BadRequestException(
        'Name must contain at least 2 characters',
      );
    }

    const email = data.email.trim().toLowerCase();

    const emailOwner = await this.prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (emailOwner) {
      throw new BadRequestException(
        'This email is already registered',
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new BadRequestException(
        'Please enter a valid email address',
      );
    }

    const dateOfBirth = new Date(
      `${data.dateOfBirth}T00:00:00.000Z`,
    );

    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new BadRequestException(
        'Please enter a valid date of birth',
      );
    }

    const today = new Date();

    if (dateOfBirth > today) {
      throw new BadRequestException(
        'Date of birth cannot be in the future',
      );
    }

    const updateData: {
      name: string;
      email: string;
      dateOfBirth: Date;
      businessRole?:
        | 'RECYCLER'
        | 'TRADER'
        | 'MANUFACTURER';
      profileImageReference?: string;
    } = {
      name,
      email,
      dateOfBirth,
    };

    /*
     * Business role is optional.
     *
     * Collector:
     *   businessRole = undefined/null
     *
     * Recycler:
     *   businessRole = RECYCLER
     *
     * Trader:
     *   businessRole = TRADER
     *
     * Manufacturer:
     *   businessRole = MANUFACTURER
     */

    if (data.businessRole !== undefined) {
      const allowedBusinessRoles = [
        'RECYCLER',
        'TRADER',
        'MANUFACTURER',
      ] as const;

      if (
        !allowedBusinessRoles.includes(
          data.businessRole,
        )
      ) {
        throw new BadRequestException(
          'Invalid business role',
        );
      }

      updateData.businessRole = data.businessRole;
    }

    if (
      data.profileImageReference !== undefined
    ) {
      updateData.profileImageReference =
        data.profileImageReference;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        dateOfBirth: true,
        businessRole: true,
        profileImageReference: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createCollectorProfile(
    userId: string,
    data: {
      address?: string;
      locationDescription?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'COLLECTOR') {
      throw new BadRequestException(
        'Only collector users can create a collector profile',
      );
    }

    const existingProfile =
      await this.prisma.collectorProfile.findUnique({
        where: { userId },
      });

    if (existingProfile) {
      throw new BadRequestException(
        'Collector profile already exists',
      );
    }

    return this.prisma.collectorProfile.create({
      data: {
        userId,
        address: data.address,
        locationDescription:
          data.locationDescription,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
  }

  async updateCollectorProfile(
    userId: string,
    data: {
      address?: string;
      locationDescription?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    const profile =
      await this.prisma.collectorProfile.findUnique({
        where: { userId },
      });

    if (!profile) {
      throw new NotFoundException(
        'Collector profile not found. Create profile first.',
      );
    }

    return this.prisma.collectorProfile.update({
      where: { userId },
      data: {
        address: data.address,
        locationDescription:
          data.locationDescription,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
  }
}