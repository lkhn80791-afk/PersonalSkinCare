import { Request, Response } from 'express';
import { CommunityPost } from '../../modules/community/CommunityPostModel';

/**
 * CommunityController exposes endpoints for simple text posts
 * where users can share their routines or experiences.
 */
export class CommunityController {
  public static async list_posts(_req: Request, res: Response): Promise<void> {
    const posts = await CommunityPost.findAll({
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    res.json(posts);
  }

  public static async create_post(req: Request, res: Response): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as { user_id: string } | undefined;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ message: 'content is required' });
      return;
    }

    const created = await CommunityPost.create({
      user_id: user.user_id,
      content: content.trim(),
    });

    res.status(201).json(created);
  }
}

