import { PrismaClient, UserRole } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const phone = process.env.ADMIN_PHONE?.trim();
  const name = process.env.ADMIN_NAME?.trim();

  if (!phone || !name) {
    throw new Error(
      'ADMIN_PHONE and ADMIN_NAME environment variables are required.',
    );
  }

  if (!/^\d{10,15}$/.test(phone)) {
    throw new Error('ADMIN_PHONE must contain 10 to 15 digits.');
  }

  // Check whether this phone number already exists.
  const existingUser = await prisma.user.findUnique({
    where: {
      phone,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  // Same phone is already an ADMIN.
  if (existingUser?.role === UserRole.ADMIN) {
    const admin = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    console.log('Admin account ready:', admin);
    return;
  }

  // Never convert an existing COLLECTOR/RECYCLER into ADMIN.
  if (existingUser) {
    throw new Error(
      `This phone number is already registered with role ${existingUser.role}. Admin provisioning stopped.`,
    );
  }

  // Check whether another ADMIN already exists.
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  if (existingAdmin) {
    throw new Error(
      'An admin account already exists. Admin provisioning stopped to prevent accidental account takeover.',
    );
  }

  // Create the first ADMIN.
  const admin = await prisma.user.create({
    data: {
      name,
      phone,
      role: UserRole.ADMIN,
      isActive: true,
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