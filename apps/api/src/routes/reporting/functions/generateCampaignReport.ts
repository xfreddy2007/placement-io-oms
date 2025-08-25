import prisma from "@placement-io-oms/database/db";
import { CampaignReport } from "@placement-io-oms/database/rest-contract/reporting";

export const generateCampaignReport = async (campaignId?: number) => {
  // Fetch campaigns with their line items
  const campaigns = await prisma.campaign.findMany({
    where: campaignId ? { id: campaignId } : undefined,
    include: {
      lineItems: true,
    },
  });

  if (!campaigns || campaigns.length === 0) {
    return {
      reports: [],
      summary: {
        totalCampaigns: 0,
        totalBookedAmount: 0,
        totalActualAmount: 0,
        totalAdjustments: 0,
        totalVariance: 0,
        averageVariancePercentage: 0,
      },
    };
  }

  // Generate reports for each campaign
  const reports: CampaignReport[] = campaigns.map((campaign) => {
    const lineItems = campaign.lineItems;

    // Calculate campaign totals
    const totalBookedAmount = lineItems.reduce(
      (sum, item) => sum + Number(item.bookedAmount),
      0
    );
    const totalActualAmount = lineItems.reduce(
      (sum, item) => sum + Number(item.actualAmount),
      0
    );
    const totalAdjustments = lineItems.reduce(
      (sum, item) => sum + Number(item.adjustments),
      0
    );
    const variance = totalBookedAmount - totalActualAmount;
    const variancePercentage =
      totalBookedAmount > 0 ? (variance / totalBookedAmount) * 100 : 0;

    // Generate line item details
    const lineItemDetails = lineItems.map((item) => {
      const itemBooked = Number(item.bookedAmount);
      const itemActual = Number(item.actualAmount);
      const itemVariance = itemBooked - itemActual;
      const itemVariancePercentage =
        itemBooked > 0 ? (itemVariance / itemBooked) * 100 : 0;

      return {
        id: item.id,
        lineItemName: item.lineItemName,
        bookedAmount: itemBooked,
        actualAmount: itemActual,
        adjustments: Number(item.adjustments),
        variance: itemVariance,
        variancePercentage: itemVariancePercentage,
      };
    });

    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      totalBookedAmount,
      totalActualAmount,
      totalAdjustments,
      variance,
      variancePercentage,
      lineItemCount: lineItems.length,
      lineItems: lineItemDetails,
    };
  });

  // Calculate summary statistics
  const summary = {
    totalCampaigns: reports.length,
    totalBookedAmount: reports.reduce(
      (sum, report) => sum + report.totalBookedAmount,
      0
    ),
    totalActualAmount: reports.reduce(
      (sum, report) => sum + report.totalActualAmount,
      0
    ),
    totalAdjustments: reports.reduce(
      (sum, report) => sum + report.totalAdjustments,
      0
    ),
    totalVariance: reports.reduce((sum, report) => sum + report.variance, 0),
    averageVariancePercentage:
      reports.length > 0
        ? reports.reduce((sum, report) => sum + report.variancePercentage, 0) /
          reports.length
        : 0,
  };

  return {
    reports,
    summary,
  };
};
