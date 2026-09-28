const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kabadiwala-connect.local';
  const phone = '9999999999';
  const name = 'System Administrator';

  const password = crypto.randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { phone },
      ],
    },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        name,
        email,
        phone,
        role: 'ADMIN',
        isActive: true,
        passwordHash,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: 'ADMIN',
        isActive: true,
        passwordHash,
      },
    });
  }

  console.log('');
  console.log('========================================');
  console.log(' ADMIN ACCOUNT CREATED SUCCESSFULLY');
  console.log('========================================');
  console.log(`Email    : ${email}`);
  console.log(`Phone    : ${phone}`);
  console.log(`Password : ${password}`);
  console.log('========================================');
  console.log('SAVE THIS PASSWORD SECURELY.');
  console.log('========================================');
  console.log('');
}

main()
  .catch((error) => {
    console.error('Admin setup failed:');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });