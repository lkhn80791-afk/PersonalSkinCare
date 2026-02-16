import { Sequelize } from 'sequelize';
import path from 'path';
import { app_config } from './env';
import '../models';

/**
 * Sequelize instance for the application.
 *
 * By default this uses a local SQLite database file so that the
 * project can run without installing PostgreSQL. To switch back
 * to PostgreSQL, set DB_DIALECT=postgres and the usual DB_*
 * environment variables.
 *
 * Sequelize uses parameterized queries internally which helps prevent
 * SQL injection when used via model APIs and query bindings.
 */
export const sequelize =
  app_config.db.dialect === 'postgres'
    ? new Sequelize(app_config.db.database, app_config.db.username, app_config.db.password, {
        host: app_config.db.host,
        port: app_config.db.port,
        dialect: 'postgres',
        logging: app_config.node_env === 'development' ? console.log : false,
      })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve(process.cwd(), app_config.db.sqlite_storage),
        logging: app_config.node_env === 'development' ? console.log : false,
      });

export async function initialize_database(): Promise<void> {
  try {
    await sequelize.authenticate();
    // Synchronize models with the database (for SQLite dev usage).
    await sequelize.sync();
    // eslint-disable-next-line no-console
    console.log('Database connection established successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

