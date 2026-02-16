import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import { sequelize } from '../../config/database';

/**
 * SkinProfileModel stores extended skin questionnaire data for a user.
 */
export interface SkinProfileAttributes {
  profile_id: string;
  user_id: string;
  skin_type: 'Dry' | 'Oily' | 'Combination';
  age?: number | null;
  dark_circles?: string | null;
  acne?: string | null;
  dryness?: string | null;
  budget?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface SkinProfileCreationAttributes
  extends Optional<
    SkinProfileAttributes,
    'profile_id' | 'age' | 'dark_circles' | 'acne' | 'dryness' | 'budget' | 'created_at' | 'updated_at'
  > {}

export class SkinProfile
  extends Model<SkinProfileAttributes, SkinProfileCreationAttributes>
  implements SkinProfileAttributes {
  public profile_id!: string;
  public user_id!: string;
  public skin_type!: 'Dry' | 'Oily' | 'Combination';
  public age!: number | null;
  public dark_circles!: string | null;
  public acne!: string | null;
  public dryness!: string | null;
  public budget!: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SkinProfile.init(
  {
    profile_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    skin_type: {
      type: DataTypes.ENUM('Dry', 'Oily', 'Combination'),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dark_circles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acne: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dryness: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    tableName: 'skin_profiles',
    underscored: true,
  },
);

