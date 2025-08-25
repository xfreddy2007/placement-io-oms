import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

// Define the reporting response schema
export const CampaignReport = z.object({
  campaignId: z.number(),
  campaignName: z.string(),
  totalBookedAmount: z.number(),
  totalActualAmount: z.number(),
  totalAdjustments: z.number(),
  variance: z.number(), // booked - actual
  variancePercentage: z.number(), // (variance / booked) * 100
  lineItemCount: z.number(),
  lineItems: z.array(
    z.object({
      id: z.number(),
      lineItemName: z.string(),
      bookedAmount: z.number(),
      actualAmount: z.number(),
      adjustments: z.number(),
      variance: z.number(),
      variancePercentage: z.number(),
    })
  ),
});

export type CampaignReport = z.infer<typeof CampaignReport>;

const reportingContract = c.router({
  getCampaignReport: {
    method: "GET",
    path: "/reporting/campaign",
    query: z.object({
      campaignId: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        reports: z.array(CampaignReport),
        summary: z.object({
          totalCampaigns: z.number(),
          totalBookedAmount: z.number(),
          totalActualAmount: z.number(),
          totalAdjustments: z.number(),
          totalVariance: z.number(),
          averageVariancePercentage: z.number(),
        }),
      }),
      204: z.object({
        message: z.string(),
      }),
    },
    summary: "Get campaign booked vs actual reporting data",
  },
});

export default reportingContract;
