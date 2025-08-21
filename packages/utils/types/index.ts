import { z } from "zod";

export const LineItem = z.object({
  id: z.number(),
  campaignId: z.number(),
  campaignName: z.string(),
  lineItemName: z.string(),
  bookedAmount: z.number(),
  actualAmount: z.number(),
  adjustments: z.number(),
});
export type LineItem = z.infer<typeof LineItem>;

export const Campaign = z.object({
  id: z.number(),
  name: z.string(),
});
export type Campaign = z.infer<typeof Campaign>;
