import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecyclersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const recycler = await this.prisma.recycler.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            role: true,
            preferredLanguage: true,
            isActive: true,
          },
        },
      },
    });

    if (!recycler) {
      throw new NotFoundException('Recycler profile not found');
    }

    return recycler;
  }

  async createProfile(
    userId: string,
    data: {
      businessName: string;
      facilityAddress: string;
      latitude?: number;
      longitude?: number;
      authorizationNumber?: string;
      acceptedMaterials: string[];
      serviceArea: string[];
      pickupAvailable?: boolean;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'RECYCLER') {
      throw new BadRequestException(
        'Only recycler users can create a recycler profile',
      );
    }

    const existing = await this.prisma.recycler.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Recycler profile already exists');
    }

    return this.prisma.recycler.create({
      data: {
        userId,
        businessName: data.businessName,
        facilityAddress: data.facilityAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        authorizationNumber: data.authorizationNumber,
        acceptedMaterials: data.acceptedMaterials,
        serviceArea: data.serviceArea,
        pickupAvailable: data.pickupAvailable ?? false,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      businessName?: string;
      facilityAddress?: string;
      latitude?: number;
      longitude?: number;
      authorizationNumber?: string;
      acceptedMaterials?: string[];
      serviceArea?: string[];
      pickupAvailable?: boolean;
    },
  ) {
    const existing = await this.prisma.recycler.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException(
        'Recycler profile not found. Create profile first.',
      );
    }

    return this.prisma.recycler.update({
      where: { userId },
      data: {
        businessName: data.businessName,
        facilityAddress: data.facilityAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        authorizationNumber: data.authorizationNumber,
        acceptedMaterials: data.acceptedMaterials,
        serviceArea: data.serviceArea,
        pickupAvailable: data.pickupAvailable,
      },
    });
  }

  // Get available e-waste lots for verified recyclers
  async getAvailableLots(userId: string) {
    const recycler = await this.prisma.recycler.findUnique({
      where: { userId },
    });

    if (!recycler) {
      throw new NotFoundException('Recycler profile not found');
    }

    if (recycler.authorizationStatus !== 'VERIFIED') {
      throw new BadRequestException(
        'Recycler authorization is not verified yet',
      );
    }

    const lots = await this.prisma.lot.findMany({
      where: {
        status: 'AVAILABLE',
        materialCategory: {
          isActive: true,
        },
      },
      include: {
        materialCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        collector: {
          select: {
            locationDescription: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: {
        collectionTimestamp: 'desc',
      },
    });

    return lots;
  }
}