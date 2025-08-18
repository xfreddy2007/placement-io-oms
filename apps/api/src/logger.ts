import { LoggerOptions, pino } from "pino";

import Env, { Environment } from "@/env";

const envToLogger: Record<Environment, LoggerOptions> = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
};

const Logger = pino(envToLogger[Env.ENVIRONMENT]);
export default Logger;
