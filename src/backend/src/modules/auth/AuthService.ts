import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { app_config } from '../../config/env';
import { User } from './UserModel';

/**
 * AuthService handles signup, login, and JWT generation.
 * Passwords are always hashed with bcrypt before being stored.
 */
export class AuthService {
  public async signup(params: {
    email: string;
    password: string;
    first_name: string;
  }): Promise<{ token: string; user: { user_id: string; email: string; first_name: string } }> {
    const existing = await User.findOne({ where: { email: params.email } });
    if (existing) {
      throw new Error('Email is already in use');
    }

    const password_hash = await bcrypt.hash(params.password, app_config.bcrypt_salt_rounds);

    const user = await User.create({
      email: params.email,
      password_hash,
      first_name: params.first_name,
    });

    const token = this.generate_jwt({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
    });

    return {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
      },
    };
  }

  public async login(params: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: { user_id: string; email: string; first_name: string } }> {
    const user = await User.findOne({ where: { email: params.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const is_match = await bcrypt.compare(params.password, user.password_hash);
    if (!is_match) {
      throw new Error('Invalid email or password');
    }

    const token = this.generate_jwt({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
    });

    return {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
      },
    };
  }

  private generate_jwt(payload: { user_id: string; email: string; first_name: string }): string {
    return jwt.sign(payload, app_config.jwt_secret, {
      expiresIn: app_config.jwt_expires_in,
    });
  }
}

