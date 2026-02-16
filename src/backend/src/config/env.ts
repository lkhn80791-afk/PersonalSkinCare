import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration loaded from environment variables.
 * In production, ensure secrets (JWT keys, DB password) are stored
 * securely (e.g. env vars, secret manager) and never committed.
 */
export const app_config = {
  node_env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  jwt_secret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '7d',
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  db: {
    dialect: (process.env.DB_DIALECT as 'sqlite' | 'postgres' | undefined) || 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'personalskin',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    sqlite_storage: process.env.SQLITE_STORAGE || 'personalskin.sqlite',
  },
};

