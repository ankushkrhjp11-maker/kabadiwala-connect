/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `businessRole` ENUM('RECYCLER', 'TRADER', 'MANUFACTURER') NULL,
    ADD COLUMN `dateOfBirth` DATE NULL,
    ADD COLUMN `email` VARCHAR(180) NULL,
    ADD COLUMN `profileImageReference` VARCHAR(500) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_businessRole_idx` ON `User`(`businessRole`);
