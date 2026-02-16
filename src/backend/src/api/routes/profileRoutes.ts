import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { auth_middleware } from '../middleware/authMiddleware';

/**
 * Routes for managing skin profiles.
 */
export const profile_routes = Router();

profile_routes.post('/', auth_middleware, ProfileController.upsert_profile);

