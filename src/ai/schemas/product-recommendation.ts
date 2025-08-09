/**
 * @fileOverview Defines the Zod schema for a product recommendation.
 */
import { z } from 'zod';

export const ProductRecommendationSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('Una breve descripción del producto en español.'),
  price: z.number().describe('The price of the product.'),
  qualityScore: z.number().describe('A score representing the quality of the product (0-100).'),
  availability: z.string().describe('The availability of the product.'),
  justification: z.string().describe('Justification for recommending this product based on user profile and search query.'),
  imageUrl: z.string().describe('A URL for an image of the product.'),
  productUrl: z.string().describe('The URL to the product page for purchase.'),
});

export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;
