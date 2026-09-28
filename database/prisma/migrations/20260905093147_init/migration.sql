-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `name` VARCHAR(120) NULL,
    `role` ENUM('COLLECTOR', 'RECYCLER', 'ADMIN') NOT NULL,
    `preferredLanguage` ENUM('EN', 'HI', 'MR') NOT NULL DEFAULT 'EN',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_role_isActive_idx`(`role`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollectorProfile` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `address` VARCHAR(500) NULL,
    `locationDescription` VARCHAR(255) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CollectorProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recycler` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `businessName` VARCHAR(160) NOT NULL,
    `facilityAddress` VARCHAR(500) NOT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `authorizationNumber` VARCHAR(120) NULL,
    `authorizationStatus` ENUM('PENDING', 'VERIFIED', 'SUSPENDED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `acceptedMaterials` JSON NOT NULL,
    `serviceArea` JSON NOT NULL,
    `pickupAvailable` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Recycler_userId_key`(`userId`),
    UNIQUE INDEX `Recycler_authorizationNumber_key`(`authorizationNumber`),
    INDEX `Recycler_authorizationStatus_pickupAvailable_idx`(`authorizationStatus`, `pickupAvailable`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaterialCategory` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MaterialCategory_slug_key`(`slug`),
    INDEX `MaterialCategory_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceBoard` (
    `id` CHAR(36) NOT NULL,
    `materialCategoryId` CHAR(36) NOT NULL,
    `location` VARCHAR(160) NOT NULL,
    `buyingPrice` DECIMAL(12, 2) NOT NULL,
    `unit` ENUM('KG', 'UNIT', 'LOT') NOT NULL,
    `marketMin` DECIMAL(12, 2) NOT NULL,
    `marketMax` DECIMAL(12, 2) NOT NULL,
    `offeredPrice` DECIMAL(12, 2) NULL,
    `effectiveDate` DATE NOT NULL,
    `source` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PriceBoard_materialCategoryId_location_effectiveDate_idx`(`materialCategoryId`, `location`, `effectiveDate`),
    INDEX `PriceBoard_location_effectiveDate_idx`(`location`, `effectiveDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lot` (
    `id` CHAR(36) NOT NULL,
    `referenceId` VARCHAR(40) NOT NULL,
    `collectorId` CHAR(36) NOT NULL,
    `materialCategoryId` CHAR(36) NOT NULL,
    `description` TEXT NULL,
    `imageReference` VARCHAR(500) NULL,
    `approximateWeight` DECIMAL(12, 3) NULL,
    `estimatedValueLow` DECIMAL(12, 2) NULL,
    `estimatedValueHigh` DECIMAL(12, 2) NULL,
    `valuationConfidence` INTEGER NULL,
    `verificationRequired` BOOLEAN NOT NULL DEFAULT false,
    `collectionTimestamp` DATETIME(3) NOT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `status` ENUM('DRAFT', 'AVAILABLE', 'OFFER_ACCEPTED', 'PICKUP_SCHEDULED', 'HANDED_OVER', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Lot_referenceId_key`(`referenceId`),
    INDEX `Lot_collectorId_status_idx`(`collectorId`, `status`),
    INDEX `Lot_materialCategoryId_status_idx`(`materialCategoryId`, `status`),
    INDEX `Lot_status_collectionTimestamp_idx`(`status`, `collectionTimestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecyclerOffer` (
    `id` CHAR(36) NOT NULL,
    `lotId` CHAR(36) NOT NULL,
    `recyclerId` CHAR(36) NOT NULL,
    `offeredPrice` DECIMAL(12, 2) NOT NULL,
    `pickupAvailable` BOOLEAN NOT NULL DEFAULT false,
    `message` VARCHAR(500) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RecyclerOffer_lotId_status_idx`(`lotId`, `status`),
    INDEX `RecyclerOffer_recyclerId_status_idx`(`recyclerId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TraceabilityEvent` (
    `id` CHAR(36) NOT NULL,
    `lotId` CHAR(36) NOT NULL,
    `eventType` ENUM('LOT_CREATED', 'QR_GENERATED', 'OFFER_ACCEPTED', 'PICKUP_BOOKED', 'HANDOVER_CONFIRMED', 'RECEIVED_BY_RECYCLER', 'STATUS_UPDATED') NOT NULL,
    `actorUserId` CHAR(36) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `photoReference` VARCHAR(500) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TraceabilityEvent_lotId_timestamp_idx`(`lotId`, `timestamp`),
    INDEX `TraceabilityEvent_actorUserId_timestamp_idx`(`actorUserId`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` CHAR(36) NOT NULL,
    `lotId` CHAR(36) NOT NULL,
    `collectorId` CHAR(36) NOT NULL,
    `recyclerId` CHAR(36) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `method` ENUM('CASH', 'UPI') NOT NULL,
    `status` ENUM('PENDING', 'RECORDED', 'CONFIRMED', 'FAILED', 'REVERSED') NOT NULL DEFAULT 'PENDING',
    `transactionReference` VARCHAR(120) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_transactionReference_key`(`transactionReference`),
    INDEX `Payment_lotId_status_idx`(`lotId`, `status`),
    INDEX `Payment_collectorId_createdAt_idx`(`collectorId`, `createdAt`),
    INDEX `Payment_recyclerId_createdAt_idx`(`recyclerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SafetyGuidance` (
    `id` CHAR(36) NOT NULL,
    `materialCategoryId` CHAR(36) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `description` TEXT NOT NULL,
    `audioReference` VARCHAR(500) NULL,
    `iconReference` VARCHAR(500) NULL,
    `language` ENUM('EN', 'HI', 'MR') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SafetyGuidance_materialCategoryId_language_isActive_idx`(`materialCategoryId`, `language`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CollectorProfile` ADD CONSTRAINT `CollectorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recycler` ADD CONSTRAINT `Recycler_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceBoard` ADD CONSTRAINT `PriceBoard_materialCategoryId_fkey` FOREIGN KEY (`materialCategoryId`) REFERENCES `MaterialCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lot` ADD CONSTRAINT `Lot_collectorId_fkey` FOREIGN KEY (`collectorId`) REFERENCES `CollectorProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lot` ADD CONSTRAINT `Lot_materialCategoryId_fkey` FOREIGN KEY (`materialCategoryId`) REFERENCES `MaterialCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecyclerOffer` ADD CONSTRAINT `RecyclerOffer_lotId_fkey` FOREIGN KEY (`lotId`) REFERENCES `Lot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecyclerOffer` ADD CONSTRAINT `RecyclerOffer_recyclerId_fkey` FOREIGN KEY (`recyclerId`) REFERENCES `Recycler`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TraceabilityEvent` ADD CONSTRAINT `TraceabilityEvent_lotId_fkey` FOREIGN KEY (`lotId`) REFERENCES `Lot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TraceabilityEvent` ADD CONSTRAINT `TraceabilityEvent_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_lotId_fkey` FOREIGN KEY (`lotId`) REFERENCES `Lot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_collectorId_fkey` FOREIGN KEY (`collectorId`) REFERENCES `CollectorProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_recyclerId_fkey` FOREIGN KEY (`recyclerId`) REFERENCES `Recycler`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SafetyGuidance` ADD CONSTRAINT `SafetyGuidance_materialCategoryId_fkey` FOREIGN KEY (`materialCategoryId`) REFERENCES `MaterialCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
