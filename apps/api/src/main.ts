import { closeServer, registerRoutes, startServer } from "@/server";

import Logger from "@/logger"";

/**
 * Description: Entry point for the backend server.
 * Registers the routes, starts the express server
 * and awaits any signals to stop the server.
 *
 * @function
 * @returns {Promise<void>}
 */
async function main() {
  Logger.info("Registering routes..");
  registerRoutes();

  Logger.info("Starting server..");
  startServer();

  const gracefulShutdown = async () => {
    await closeServer();
  };

  // listen for TERM signal .e.g. kill
  process.once("SIGTERM", async () => {
    await gracefulShutdown();
  });
  // listen for INT signal e.g. Ctrl-C
  process.once("SIGINT", async () => {
    await gracefulShutdown();
  });
}

main();
