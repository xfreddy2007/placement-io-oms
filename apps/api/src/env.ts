import "dotenv/config";

import { Env } from "@(-.-)/env";
import { z } from "zod";

const environment = z
  .enum(["development", "production"])
  .default("development");
export type Environment = z.infer<typeof environment>;

const EnvironmentSchema = z.object({
  ENVIRONMENT: environment,
  PORT: z.coerce.number(),
});

export default Env(EnvironmentSchema);
export type EnvConfig = z.infer<typeof EnvironmentSchema>;
