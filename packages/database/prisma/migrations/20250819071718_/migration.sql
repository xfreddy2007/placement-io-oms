-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_items" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "campaignName" TEXT NOT NULL,
    "lineItemName" TEXT NOT NULL,
    "bookedAmount" DECIMAL(15,10) NOT NULL,
    "actualAmount" DECIMAL(15,10) NOT NULL,
    "adjustments" DECIMAL(15,10) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "line_items" ADD CONSTRAINT "line_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
