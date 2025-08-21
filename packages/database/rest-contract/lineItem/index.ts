import { initContract } from "@ts-rest/core";
import { LineItem } from "@placement-io-oms/utils/types";
import { z } from "zod";

const c = initContract();

const lineItemContract = c.router({
  getLineItem: {
    method: "GET",
    path: "/line-items",
    query: z.object({
      campaignId: z.coerce.number(),
      id: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        lineItems: z.array(LineItem),
      }),
      204: z.object({
        message: z.string(),
      }),
    },
    summary: "Get all existing line items",
  },
});

export default lineItemContract;
