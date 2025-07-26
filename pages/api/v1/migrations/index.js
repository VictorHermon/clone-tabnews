import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controllers.js";

const router = createRouter();

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

router.get(getHendler);
router.post(postHendler);

export default router.handler(controller.errorHandlers);

async function getHendler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pedingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return response.status(200).json(pedingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHendler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
