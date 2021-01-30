import * as fcl from '../../node_modules/@onflow/fcl';
import initExpress from './initExpress';
import Knex from 'knex';

async function run() {
  const knexInstance: Knex = Knex({
    client: 'postgresql',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    },
    migrations: {
      directory:
        process.env.MIGRATION_PATH || './src/modules/db/objection/migrations',
    },
  });

  // Make sure to disconnect from DB when exiting the process
  process.on('SIGTERM', () => {
    knexInstance.destroy().then(() => {
      process.exit(0);
    });
  });
  await knexInstance.migrate.latest();

  fcl.config().put('accessNode.api', process.env.FLOW_NODE);

  const app = initExpress(knexInstance);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
}

run().catch((e) => {
  console.error('error', e);
  process.exit(1);
});
