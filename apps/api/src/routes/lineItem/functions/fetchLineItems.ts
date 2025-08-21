import prisma from "@placement-io-oms/database/db";
import { LineItem } from "@placement-io-oms/utils/types";

export const fetchLineItems = async (
  campaignId: number,
  id?: number
): Promise<LineItem[]> => {
  // Fetch all related line items, if id is provided, fetch the related id only
  const lineItems = await prisma.lineItem.findMany({
    where: { campaignId, id },
  });

  if (!lineItems) {
    return [];
  }

  return lineItems.map((item) => ({
    id: item.id,
    campaignId: item.campaignId,
    campaignName: item.campaignName,
    lineItemName: item.lineItemName,
    bookedAmount: Number(item.bookedAmount.toString()),
    actualAmount: Number(item.actualAmount.toString()),
    adjustments: Number(item.adjustments.toString()),
  }));
};
