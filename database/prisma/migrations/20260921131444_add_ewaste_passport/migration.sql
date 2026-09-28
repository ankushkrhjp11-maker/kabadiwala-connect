-- DropForeignKey
ALTER TABLE `recycleroffer` DROP FOREIGN KEY `RecyclerOffer_recyclerId_fkey`;

-- CreateTable
CREATE TABLE `ewastepassport` (
    `id` CHAR(36) NOT NULL,
    `passportCode` VARCHAR(60) NOT NULL,
    `lotId` CHAR(36) NOT NULL,
    `publicToken` VARCHAR(100) NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `currentStage` VARCHAR(80) NOT NULL,
    `finalOutcome` VARCHAR(120) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EWastePassport_passportCode_key`(`passportCode`),
    UNIQUE INDEX `EWastePassport_lotId_key`(`lotId`),
    UNIQUE INDEX `EWastePassport_publicToken_key`(`publicToken`),
    INDEX `EWastePassport_currentStage_idx`(`currentStage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ewastepassport` ADD CONSTRAINT `EWastePassport_lotId_fkey` FOREIGN KEY (`lotId`) REFERENCES `lot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recycleroffer` ADD CONSTRAINT `RecyclerOffer_recyclerId_fkey` FOREIGN KEY (`recyclerId`) REFERENCES `recycler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
