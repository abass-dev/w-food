/*
  Warnings:

  - You are about to drop the column `date` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
