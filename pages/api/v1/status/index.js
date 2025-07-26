import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controllers.js";

const router = createRouter();

router.get(getHendler);

export default router.handler(controller.errorHandlers);

async function getHendler(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("show server_version;");
  const databaseVersionValue = databaseVersionResult[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "show max_connections",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databseOpenedConnectionsResult = await database.query({
    text: "select count(*)::int from pg_stat_activity where datname = $1",
    values: [databaseName],
  });

  const databseOpenedConnectionsValue = databseOpenedConnectionsResult[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databseOpenedConnectionsValue,
      },
    },
  });
}
