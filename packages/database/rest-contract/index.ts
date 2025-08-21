import { initContract } from "@ts-rest/core";
import { z } from "zod";

import campaignContract from "./campaign";
import lineItemContract from "./lineItem";

const c = initContract();

export default c.router(
  {
    campaign: campaignContract,
    lineItem: lineItemContract,
  },
  {
    baseHeaders: z.object({
      authorization: z.string().optional(),
    }),
  }
);
