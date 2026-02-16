import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
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

  // Serve static frontend (simple HTML/JS) from src/frontend
  const frontend_path = path.join(process.cwd(), 'src', 'frontend');
  app.use(express.static(frontend_path));

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

  // Fallback to index.html for root path (basic SPA behavior)
  app.get('/', (_req, res) => {
    res.sendFile(path.join(frontend_path, 'index.html'));
  });

  return app;
}

