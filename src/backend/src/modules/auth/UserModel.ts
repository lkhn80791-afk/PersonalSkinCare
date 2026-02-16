import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import { sequelize } from '../../config/database';

/**
 * UserModel defines the persisted user entity used for authentication.
 * Passwords must be stored as bcrypt password_hash values, never in plain text.
 */
export interface UserAttributes {
  user_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'user_id' | 'password_hash' | 'created_at' | 'updated_at'> {
  // password_hash will be set by the AuthService after hashing the raw password.
}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public user_id!: string;
  public email!: string;
  public password_hash!: string;
  public first_name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true, // snake_case columns
  },
);

