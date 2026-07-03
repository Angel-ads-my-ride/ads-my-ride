-- AlterTable
ALTER TABLE "ads" ADD COLUMN     "countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "modelSelectionMode" TEXT NOT NULL DEFAULT 'ALL_EXCEPT',
ADD COLUMN     "vehicleConditions" TEXT[] DEFAULT ARRAY[]::TEXT[];
