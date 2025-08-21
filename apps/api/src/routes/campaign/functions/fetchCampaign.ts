import prisma from "@placement-io-oms/database/db";
import { Campaign } from "@placement-io-oms/utils/types";

export const fetchCampaign = async (id?: number): Promise<Campaign[]> => {
  // Fetch all related campaigns, if id is provided, fetch the related id only
  const campaigns = await prisma.campaign.findMany({
    where: { id },
  });

  return campaigns.map((element) => ({
    id: element.id,
    name: element.name,
  }));
};
