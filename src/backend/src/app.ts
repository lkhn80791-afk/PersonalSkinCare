import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { auth_routes } from './api/routes/authRoutes';
import { routine_routes } from './api/routes/routineRoutes';
import { profile_routes } from './api/routes/profileRoutes';
import { community_routes } from './api/routes/communityRoutes';

/**
 * Creates and configures the Express application.
 * Serves the HTML/JS frontend and exposes API routes.
 */
export function create_app(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Serve static frontend (simple HTML/JS) from src/frontend
  const frontend_path = path.join(process.cwd(), 'src', 'frontend');
  app.use(express.static(frontend_path));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Core API routes
  app.use('/auth', auth_routes);
  app.use('/profiles', profile_routes);
  // app.use('/products', productRoutes); // future extension
  app.use('/routines', routine_routes);
  app.use('/community', community_routes);

  // Fallback to index.html for root path (basic SPA behavior)
  app.get('/', (_req, res) => {
    res.sendFile(path.join(frontend_path, 'index.html'));
  });

  return app;
}

