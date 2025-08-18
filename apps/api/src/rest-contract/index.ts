import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export default c.router(
  {},
  {
    baseHeaders: z.object({
      authorization: z.string().optional(),
    }),
  }
);
