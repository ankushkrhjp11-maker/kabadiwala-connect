import { PrismaClient, UserRole } from '../generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const phone = process.env.ADMIN_PHONE;
  const name = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!phone || !name || !password) {
    throw new Error(
      'ADMIN_PHONE, ADMIN_NAME and ADMIN_PASSWORD environment variables are required.',
    );
  }

  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { phone },
        { role: UserRole.ADMIN },
      ],
    },
  });

  if (existingAdmin) {
    const updatedAdmin = await prisma.user.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        name,
        phone,
        role: UserRole.ADMIN,
        isActive: true,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    console.log('Admin account ready:', updatedAdmin);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name,
      phone,
      role: UserRole.ADMIN,
      isActive: true,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  console.log('Admin account created:', admin);
}

main()
  .catch((error) => {
    console.error('Failed to provision admin:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });