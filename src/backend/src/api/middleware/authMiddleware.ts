import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { app_config } from '../../config/env';

interface AuthPayload {
  user_id: string;
  email: string;
  first_name: string;
}

/**
 * authMiddleware validates incoming JWT tokens from the Authorization header
 * and attaches the decoded user payload to the request object.
 */
export function auth_middleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = header.substring('Bearer '.length);

  try {
    const decoded = jwt.verify(token, app_config.jwt_secret) as AuthPayload;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

