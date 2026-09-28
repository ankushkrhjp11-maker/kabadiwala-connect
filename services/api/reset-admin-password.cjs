const { PrismaClient, UserRole } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const phone = '9905843618';
  const name = 'Admin';
  const password = 'Admin@123';

  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      phone,
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

    console.log('Admin password reset successfully:');
    console.log(updatedAdmin);
    console.log('Password:', password);
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

  console.log('Admin account created successfully:');
  console.log(admin);
  console.log('Password:', password);
}

main()
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });