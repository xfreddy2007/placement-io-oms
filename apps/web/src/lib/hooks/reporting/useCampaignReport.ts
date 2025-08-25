import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/lib/api";

export function useCampaignReport(campaignId?: number) {
  const query = useQuery({
    queryKey: ["getCampaignReport", campaignId],
    queryFn: async () => {
      const response = await ApiClient.reporting.getCampaignReport.query({
        query: { campaignId },
      });

      if (response.status === 200) {
        return response.body;
      }

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
    },
  });

  return query;
}
