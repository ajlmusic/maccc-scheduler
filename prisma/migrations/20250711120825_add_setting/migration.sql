-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "seasonLabel" TEXT,
    "googleMapsApiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
