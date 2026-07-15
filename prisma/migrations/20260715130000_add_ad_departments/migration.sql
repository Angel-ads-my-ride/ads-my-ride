-- AlterTable
ALTER TABLE "ads" ADD COLUMN     "departments" TEXT[] DEFAULT ARRAY[]::TEXT[];
