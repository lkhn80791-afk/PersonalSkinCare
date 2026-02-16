import { Request, Response } from 'express';
import {
  RecommendationService,
  RoutineRecommendation,
} from '../../modules/routines/RecommendationService';

const recommendation_service = new RecommendationService();

/**
 * RoutineController exposes HTTP handlers for generating routines.
 */
export class RoutineController {
  public static async generate_recommendation(req: Request, res: Response): Promise<void> {
    const { skin_type, concerns, budget_range } = req.body;

    // Normalize skin type to a canonical value so the API is tolerant
    // of differences in casing or extra whitespace from clients.
    const raw_skin_type = typeof skin_type === 'string' ? skin_type.trim().toLowerCase() : '';
    let normalized_skin_type: 'Dry' | 'Oily' | 'Combination' | null = null;

    if (raw_skin_type === 'dry') {
      normalized_skin_type = 'Dry';
    } else if (raw_skin_type === 'oily') {
      normalized_skin_type = 'Oily';
    } else if (raw_skin_type === 'combination') {
      normalized_skin_type = 'Combination';
    }

    if (!normalized_skin_type) {
      res.status(400).json({ message: 'skin_type must be Dry, Oily or Combination' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as { user_id: string } | undefined;
    const user_id = user?.user_id ?? 'anonymous-user';

    const routine: RoutineRecommendation = recommendation_service.generateRoutine({
      user_id,
      skin_type: normalized_skin_type,
      concerns: Array.isArray(concerns) ? concerns : [],
      budget_range,
    });

    res.json(routine);
  }
}

