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
  updateAdjustments: {
    method: "PUT",
    path: "/line-items/update",
    body: z.object({
      id: z.coerce.number(),
      adjustments: z.coerce.number(),
    }),
    responses: {
      201: z.object({
        lineItem: LineItem,
      }),
      204: z.object({
        message: z.string(),
      }),
    },
    summary: "Update the adjustments for a specific line item",
  },
});

export default lineItemContract;
