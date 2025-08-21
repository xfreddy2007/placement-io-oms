import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/lib/api";

export function useFetchLineItems(campaignId: number, id?: number) {
  const query = useQuery({
    queryKey: ["getLineItem", campaignId, id],
    queryFn: async () => {
      const response = await ApiClient.lineItem.getLineItem.query({
        query: { campaignId, id },
      });

      if (response.status === 200) {
        return response.body.lineItems;
      }

      return [];
    },
    enabled: !!campaignId,
  });

  return query;
}
