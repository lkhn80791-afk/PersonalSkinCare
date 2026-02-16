import express, { Application } from 'express';
import cors from 'cors';
import { auth_routes } from './api/routes/authRoutes';
import { routine_routes } from './api/routes/routineRoutes';

/**
 * Creates and configures the Express application.
 * API routes for auth, profiles, products, routines, and community
 * will be registered here in dedicated modules.
 */
export function create_app(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Core API routes
  app.use('/auth', auth_routes);
  // app.use('/profiles', profileRoutes);
  // app.use('/products', productRoutes);
  app.use('/routines', routine_routes);
  // app.use('/community', communityRoutes);

  return app;
}

