import { createRouter } from "next-connect";
import controller from "infra/controllers.js";
import migrator from "models/migrator.js";

const router = createRouter();
router.get(getHendler);
router.post(postHendler);

export default router.handler(controller.errorHandlers);

async function getHendler(request, response) {
  const pedingMigrations = await migrator.listPendingMigrations();

  return response.status(200).json(pedingMigrations);
}

async function postHendler(request, response) {
  let statusCode = 200;
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    statusCode = 201;
  }

  return response.status(statusCode).json(migratedMigrations);
}
