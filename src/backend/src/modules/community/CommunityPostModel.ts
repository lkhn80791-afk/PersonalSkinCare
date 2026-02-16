import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import { sequelize } from '../../config/database';

export interface CommunityPostAttributes {
  post_id: string;
  user_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommunityPostCreationAttributes
  extends Optional<CommunityPostAttributes, 'post_id' | 'created_at' | 'updated_at'> {}

export class CommunityPost
  extends Model<CommunityPostAttributes, CommunityPostCreationAttributes>
  implements CommunityPostAttributes {
  public post_id!: string;
  public user_id!: string;
  public content!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CommunityPost.init(
  {
    post_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
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
    tableName: 'community_posts',
    underscored: true,
  },
);

