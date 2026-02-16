/**
 * RecommendationService is responsible for generating personalized
 * skincare routines based on a user's skin profile and concerns.
 *
 * In a later iteration this class should integrate with:
 * - The products catalog (PostgreSQL via Sequelize)
 * - A rule-based or ML-based recommendation engine
 * - User feedback and tracking history
 */
export interface UserProfile {
  user_id: string;
  skin_type: 'Dry' | 'Oily' | 'Combination';
  concerns: string[]; // e.g. ['Acne', 'Wrinkles']
  budget_range?: string;
}

export interface RecommendedProduct {
  product_id: string;
  name: string;
  suitable_skin_types: Array<'Dry' | 'Oily' | 'Combination'>;
  price: number;
  step_type: 'Cleanser' | 'Toner' | 'Serum' | 'Moisturizer' | 'Sunscreen';
}

/**
 * RoutineRecommendation represents a simple structure for the
 * recommended morning and evening products.
 */
export interface RoutineRecommendation {
  user_id: string;
  morning_products: RecommendedProduct[];
  evening_products: RecommendedProduct[];
}

export class RecommendationService {
  /**
   * generateRoutine takes a user profile and returns a mock routine
   * with different product sets depending on the skin_type.
   *
   * In production, this method should:
   * - Query the products table with filters (skin_type, ingredients, budget_range)
   * - Apply business rules and safety checks
   * - Prevent SQL injection via parameterized queries (handled by Sequelize)
   */
  public generateRoutine(user_profile: UserProfile): RoutineRecommendation {
    const { skin_type, user_id } = user_profile;

    let morning_products: RecommendedProduct[] = [];
    let evening_products: RecommendedProduct[] = [];

    if (skin_type === 'Dry') {
      morning_products = [
        {
          product_id: 'mock-cleanser-dry-1',
          name: 'Gentle Hydrating Cleanser',
          suitable_skin_types: ['Dry', 'Combination'],
          price: 19.99,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-moisturizer-dry-1',
          name: 'Deep Moisture Cream',
          suitable_skin_types: ['Dry'],
          price: 24.99,
          step_type: 'Moisturizer',
        },
        {
          product_id: 'mock-sunscreen-dry-1',
          name: 'Nourishing SPF 30',
          suitable_skin_types: ['Dry', 'Combination'],
          price: 21.5,
          step_type: 'Sunscreen',
        },
      ];

      evening_products = [
        {
          product_id: 'mock-cleanser-dry-2',
          name: 'Creamy Night Cleanser',
          suitable_skin_types: ['Dry'],
          price: 18.5,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-serum-dry-1',
          name: 'Hyaluronic Acid Serum',
          suitable_skin_types: ['Dry', 'Combination'],
          price: 29.0,
          step_type: 'Serum',
        },
        {
          product_id: 'mock-moisturizer-dry-2',
          name: 'Overnight Repair Balm',
          suitable_skin_types: ['Dry'],
          price: 32.0,
          step_type: 'Moisturizer',
        },
      ];
    } else if (skin_type === 'Oily') {
      morning_products = [
        {
          product_id: 'mock-cleanser-oily-1',
          name: 'Foaming Oil-Control Cleanser',
          suitable_skin_types: ['Oily', 'Combination'],
          price: 17.99,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-toner-oily-1',
          name: 'BHA Exfoliating Toner',
          suitable_skin_types: ['Oily'],
          price: 22.5,
          step_type: 'Toner',
        },
        {
          product_id: 'mock-sunscreen-oily-1',
          name: 'Matte Finish SPF 50',
          suitable_skin_types: ['Oily', 'Combination'],
          price: 23.5,
          step_type: 'Sunscreen',
        },
      ];

      evening_products = [
        {
          product_id: 'mock-cleanser-oily-2',
          name: 'Purifying Gel Cleanser',
          suitable_skin_types: ['Oily'],
          price: 18.0,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-serum-oily-1',
          name: 'Niacinamide 10% Serum',
          suitable_skin_types: ['Oily', 'Combination'],
          price: 27.0,
          step_type: 'Serum',
        },
        {
          product_id: 'mock-moisturizer-oily-1',
          name: 'Oil-Free Gel Moisturizer',
          suitable_skin_types: ['Oily', 'Combination'],
          price: 24.0,
          step_type: 'Moisturizer',
        },
      ];
    } else if (skin_type === 'Combination') {
      morning_products = [
        {
          product_id: 'mock-cleanser-combo-1',
          name: 'Balancing Gel Cleanser',
          suitable_skin_types: ['Combination'],
          price: 18.99,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-serum-combo-1',
          name: 'Multi-Tasking Antioxidant Serum',
          suitable_skin_types: ['Combination', 'Dry', 'Oily'],
          price: 30.0,
          step_type: 'Serum',
        },
        {
          product_id: 'mock-sunscreen-combo-1',
          name: 'Lightweight SPF 40',
          suitable_skin_types: ['Combination'],
          price: 25.0,
          step_type: 'Sunscreen',
        },
      ];

      evening_products = [
        {
          product_id: 'mock-cleanser-combo-2',
          name: 'Gentle Balancing Cleanser',
          suitable_skin_types: ['Combination'],
          price: 19.5,
          step_type: 'Cleanser',
        },
        {
          product_id: 'mock-toner-combo-1',
          name: 'pH Balancing Toner',
          suitable_skin_types: ['Combination'],
          price: 20.0,
          step_type: 'Toner',
        },
        {
          product_id: 'mock-moisturizer-combo-1',
          name: 'Adaptive Hydrating Lotion',
          suitable_skin_types: ['Combination'],
          price: 26.0,
          step_type: 'Moisturizer',
        },
      ];
    } else {
      // Fallback: basic empty routine if skin_type is unexpected
      morning_products = [];
      evening_products = [];
    }

    return {
      user_id,
      morning_products,
      evening_products,
    };
  }
}

