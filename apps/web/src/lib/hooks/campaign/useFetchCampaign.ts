import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/lib/api";

export function useFetchCampaign(id?: number) {
  const query = useQuery({
    queryKey: ["getCampaign", id],
    queryFn: async () => {
      const response = await ApiClient.campaign.getCampaign.query({
        query: { id },
      });

      if (response.status === 200) {
        return response.body.campaigns;
      }

      return [];
    },
  });

  return query;
}
