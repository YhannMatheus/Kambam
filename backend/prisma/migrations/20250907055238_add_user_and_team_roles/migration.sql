/*
  Warnings:

  - The `role` column on the `TeamMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'SUPPORT');

-- CreateEnum
CREATE TYPE "public"."TeamMemberRole" AS ENUM ('MEMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."TeamMember" DROP COLUMN "role",
ADD COLUMN     "role" "public"."TeamMemberRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';
