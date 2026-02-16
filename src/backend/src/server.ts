import { create_app } from './app';
import { app_config } from './config/env';
import { initialize_database } from './config/database';
// Import models so Sequelize registers them before syncing
import './modules/auth/UserModel';
import './modules/profiles/SkinProfileModel';
import './modules/community/CommunityPostModel';

/**
 * Entry point for the PersonalSkin backend.
 * Initializes the database connection and starts the HTTP server.
 */
async function start_server(): Promise<void> {
  await initialize_database();

  const app = create_app();
  const port = app_config.port;

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`PersonalSkin backend listening on port ${port}`);
  });
}

void start_server();

