import { Request, Response } from 'express';
import { AuthService } from '../../modules/auth/AuthService';

const auth_service = new AuthService();

/**
 * AuthController exposes HTTP handlers for signup and login.
 */
export class AuthController {
  public static async signup(req: Request, res: Response): Promise<void> {
    const { email, password, first_name } = req.body;

    if (!email || !password || !first_name) {
      res.status(400).json({ message: 'email, password and first_name are required' });
      return;
    }

    try {
      const result = await auth_service.signup({ email, password, first_name });
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      res.status(400).json({ message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'email and password are required' });
      return;
    }

    try {
      const result = await auth_service.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(400).json({ message });
    }
  }
}

