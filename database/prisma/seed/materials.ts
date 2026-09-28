import { PrismaClient } from '../../../services/api/src/generated/prisma/client';

const prisma = new PrismaClient();
const categories = [
  {
    name: 'CRT',
    slug: 'crt',
    description: 'Cathode Ray Tube televisions and monitors',
  },
  {
    name: 'LCD / LED Panels',
    slug: 'lcd-led-panels',
    description: 'LCD and LED display panels and screens',
  },
  {
    name: 'PCB',
    slug: 'pcb',
    description: 'Printed Circuit Boards and electronic boards',
  },
  {
    name: 'Cables',
    slug: 'cables',
    description: 'Copper, electrical and electronic cables',
  },
  {
    name: 'Batteries',
    slug: 'batteries',
    description: 'Used batteries and battery packs',
  },
  {
    name: 'Motors / Magnet-bearing Assemblies',
    slug: 'motors-magnet-assemblies',
    description: 'Motors, magnetic assemblies and related components',
  },
  {
    name: 'Mixed Plastics',
    slug: 'mixed-plastics',
    description: 'Plastic components recovered from electronic waste',
  },
  {
    name: 'Other E-waste',
    slug: 'other-e-waste',
    description: 'Other electronic waste not covered by specific categories',
  },
];

async function main() {
  for (const category of categories) {
    await prisma.materialCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        isActive: true,
      },
      create: category,
    });
  }

  console.log('Material categories seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });