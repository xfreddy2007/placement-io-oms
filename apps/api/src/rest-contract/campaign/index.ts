import { initContract } from "@ts-rest/core";
import { Campaign } from "@placement-io-oms/utils/types";
import { z } from "zod";

const c = initContract();

const campaignContract = c.router({
  getCampaign: {
    method: "GET",
    path: "/campaign",
    query: z.object({
      id: z.number().optional(),
    }),
    responses: {
      200: z.object({
        campaigns: z.array(Campaign),
      }),
      204: z.object({
        message: z.string(),
      }),
    },
    summary: "Get all existing campaigns",
  },
});

export default campaignContract;
