import { Request, Response } from 'express';
import { SkinProfile } from '../../modules/profiles/SkinProfileModel';

/**
 * ProfileController handles creation/updating of skin profiles
 * based on the extended questionnaire.
 */
export class ProfileController {
  public static async upsert_profile(req: Request, res: Response): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as { user_id: string } | undefined;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      skin_type,
      age,
      dark_circles,
      acne,
      dryness,
      budget,
    } = req.body;

    const normalized_skin_type =
      typeof skin_type === 'string' ? skin_type.trim().toLowerCase() : '';

    let canonical_skin_type: 'Dry' | 'Oily' | 'Combination' | null = null;
    if (normalized_skin_type === 'dry') canonical_skin_type = 'Dry';
    if (normalized_skin_type === 'oily') canonical_skin_type = 'Oily';
    if (normalized_skin_type === 'combination') canonical_skin_type = 'Combination';

    if (!canonical_skin_type) {
      res.status(400).json({ message: 'skin_type must be Dry, Oily or Combination' });
      return;
    }

    const age_number = typeof age === 'number' ? age : Number(age) || null;
    const budget_number = typeof budget === 'number' ? budget : Number(budget) || null;

    const existing = await SkinProfile.findOne({ where: { user_id: user.user_id } });

    if (existing) {
      existing.skin_type = canonical_skin_type;
      existing.age = age_number;
      existing.dark_circles = dark_circles ?? null;
      existing.acne = acne ?? null;
      existing.dryness = dryness ?? null;
      existing.budget = budget_number;
      await existing.save();
      res.json(existing);
      return;
    }

    const created = await SkinProfile.create({
      user_id: user.user_id,
      skin_type: canonical_skin_type,
      age: age_number,
      dark_circles: dark_circles ?? null,
      acne: acne ?? null,
      dryness: dryness ?? null,
      budget: budget_number,
    });

    res.status(201).json(created);
  }
}

