import prisma from "@placement-io-oms/database/db";
import { LineItem } from "@placement-io-oms/utils/types";

export const updateLineItem = async (
  id: number,
  adjustments: number
): Promise<LineItem | undefined> => {
  // Update the adjustments for the provided line item id
  const lineItem = await prisma.lineItem.update({
    where: { id },
    data: {
      adjustments,
    },
  });

  const result: LineItem = {
    id: lineItem.id,
    campaignId: lineItem.campaignId,
    campaignName: lineItem.campaignName,
    lineItemName: lineItem.lineItemName,
    bookedAmount: Number(lineItem.bookedAmount.toString()),
    actualAmount: Number(lineItem.actualAmount.toString()),
    adjustments: Number(lineItem.adjustments.toString()),
  };

  return result ?? undefined;
};
