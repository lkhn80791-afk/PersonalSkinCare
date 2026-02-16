import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

/**
 * Routes for authentication (signup/login).
 */
export const auth_routes = Router();

auth_routes.post('/signup', AuthController.signup);
auth_routes.post('/login', AuthController.login);

