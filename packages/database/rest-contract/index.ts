import { initContract } from "@ts-rest/core";
import { z } from "zod";

import campaignContract from "./campaign";
import lineItemContract from "./lineItem";
import reportingContract from "./reporting";

const c = initContract();

export default c.router(
  {
    campaign: campaignContract,
    lineItem: lineItemContract,
    reporting: reportingContract,
  },
  {
    baseHeaders: z.object({
      authorization: z.string().optional(),
    }),
  }
);
