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

    if (!skin_type || !['Dry', 'Oily', 'Combination'].includes(skin_type)) {
      res.status(400).json({ message: 'skin_type must be Dry, Oily or Combination' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as { user_id: string } | undefined;
    const user_id = user?.user_id ?? 'anonymous-user';

    const routine: RoutineRecommendation = recommendation_service.generateRoutine({
      user_id,
      skin_type,
      concerns: Array.isArray(concerns) ? concerns : [],
      budget_range,
    });

    res.json(routine);
  }
}

