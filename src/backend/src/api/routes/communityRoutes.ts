import { Router } from 'express';
import { CommunityController } from '../controllers/CommunityController';
import { auth_middleware } from '../middleware/authMiddleware';

/**
 * Routes for community posts.
 */
export const community_routes = Router();

community_routes.get('/posts', CommunityController.list_posts);
community_routes.post('/posts', auth_middleware, CommunityController.create_post);

