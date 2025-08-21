import { initContract } from "@ts-rest/core";
import { LineItem } from "@placement-io-oms/utils/types";
import { z } from "zod";

const c = initContract();

const lineItemContract = c.router({
  getLineItem: {
    method: "GET",
    path: "/lineItems",
    query: z.object({
      id: z.number().optional(),
      campaignId: z.number().optional(),
    }),
    responses: {
      200: z.object({
        lineItems: z.array(LineItem),
      }),
      204: z.object({}),
    },
    summary: "Get all existing line items",
  },
});

export default lineItemContract;
