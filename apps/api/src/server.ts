import contract from "@/rest-contract";
import { createExpressEndpoints } from "@ts-rest/express";
import { generateOpenApi } from "@ts-rest/open-api";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { Server } from "http";
import swaggerUi from "swagger-ui-express";

import Env from "@/env";
import campaignRouter from "./routes/campaign/router";
import lineItemRouter from "./routes/lineItem/router";
import Logger from "@/logger";

const app: Express = express();
let server: Server | null = null;

/**
 * Description: Registers the routes for the express app. Register new endpoints by:
 * 1) Creating/updating the rest-contract
 * 2) Create/update the route implementing the contract
 * 3) Register the route here
 *
 * @function
 * @returns {void}
 */
export function registerRoutes(): void {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Timing request middleware
  app.use((req, res, next) => {
    const startTime = performance.now();
    res.on("finish", () => {
      const endTime = performance.now();
      Logger.debug(
        `${req.method} ${req.originalUrl} statusCode=${res.statusCode} executionTime=${(endTime - startTime).toFixed(2)}ms`
      );
    });
    next();
  });

  // Set up Swagger UI on dev
  if (Env.ENVIRONMENT === "development") {
    const openApiDocument = generateOpenApi(contract, {
      info: {
        title: "Placement.io OMS API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    });
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  }

  createExpressEndpoints(contract.campaign, campaignRouter, app);
  createExpressEndpoints(contract.lineItem, lineItemRouter, app);
}

/**
 * Description: Starts the express server
 *
 * @function
 * @returns {void}
 */
export function startServer(): void {
  const port = Env.PORT;
  server = app.listen({ host: "0.0.0.0", port: port }, () => {
    Logger.info(`Server is listening on port ${port}`);
  });
}

/**
 * Description: Closes the express server.
 *
 * @function
 * @returns {Promise<void>}
 */
export async function closeServer(): Promise<void> {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => {
        if (err) {
          Logger.error("Error while closing the server:", err);
          reject(err);
          process.exit(1);
        } else {
          Logger.info("Server closed..");
          resolve();
          process.exit(0);
        }
      });
    });
  }
}

export default app;
