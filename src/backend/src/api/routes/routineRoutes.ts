import { Router } from 'express';
import { RoutineController } from '../controllers/RoutineController';
import { auth_middleware } from '../middleware/authMiddleware';

/**
 * Routes for routines and recommendation engine.
 */
export const routine_routes = Router();

routine_routes.post(
  '/recommendation',
  auth_middleware,
  RoutineController.generate_recommendation,
);

