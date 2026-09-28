import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.materialCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.materialCategory.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Material category not found');
    }

    return category;
  }
}