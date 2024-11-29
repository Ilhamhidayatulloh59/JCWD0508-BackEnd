-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleUser" NOT NULL DEFAULT 'User';
