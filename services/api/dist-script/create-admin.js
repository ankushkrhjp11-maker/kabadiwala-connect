"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    const phone = process.env.ADMIN_PHONE;
    const name = process.env.ADMIN_NAME;
    if (!phone || !name) {
        throw new Error('ADMIN_PHONE and ADMIN_NAME environment variables are required.');
    }
    const existingAdmin = await prisma.user.findFirst({
        where: {
            OR: [
                { phone },
                { role: prisma_1.UserRole.ADMIN },
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
                role: prisma_1.UserRole.ADMIN,
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
        console.log('Admin account ready:', updatedAdmin);
        return;
    }
    const admin = await prisma.user.create({
        data: {
            name,
            phone,
            role: prisma_1.UserRole.ADMIN,
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
