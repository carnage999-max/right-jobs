/*
  Warnings:

  - The values [REMOTE] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('YEARLY', 'MONTHLY', 'WEEKLY', 'HOURLY');

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');
ALTER TABLE "Job" ALTER COLUMN "type" TYPE "JobType_new" USING ("type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "JobType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "companyLogoUrl" TEXT,
ADD COLUMN     "contractDuration" TEXT,
ADD COLUMN     "officeImageUrl" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "salaryType" "SalaryType" NOT NULL DEFAULT 'YEARLY',
ADD COLUMN     "workMode" "WorkMode" NOT NULL DEFAULT 'ONSITE';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "resumeFilename" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sessionVersion" INTEGER NOT NULL DEFAULT 0;
