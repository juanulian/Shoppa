'use server';

/**
 * @fileOverview An intelligent search agent that finds the best product options based on the search query and user profile data.
 *
 * - intelligentSearchAgent - A function that handles the product search process.
 * - IntelligentSearchAgentInput - The input type for the intelligentSearchAgent function.
 * - IntelligentSearchAgentOutput - The return type for the intelligentSearchAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSearchAgentInputSchema = z.object({
  searchQuery: z.string().describe('The user search query.'),
  userProfileData: z.string().describe('User profile data collected from onboarding questions.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

const ProductRecommendationSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  price: z.number().describe('The price of the product.'),
  qualityScore: z.number().describe('A score representing the quality of the product (0-100).'),
  availability: z.string().describe('The availability of the product.'),
  justification: z.string().describe('Justification for recommending this product based on user profile and search query.'),
});

const IntelligentSearchAgentOutputSchema = z.array(ProductRecommendationSchema).describe('A list of product recommendations.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  return intelligentSearchAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  prompt: `You are an intelligent shopping assistant that finds the best products for the user based on their search query and profile data.

  Search Query: {{{searchQuery}}}
  User Profile Data: {{{userProfileData}}}

  Based on the search query and user profile data, find the 3-5 best products and justify why each product is a good recommendation for the user. Consider price, quality, availability, and relevance to the user's profile when making recommendations. The output should be a JSON array of product recommendations.

  Each product should have a productName, productDescription, price, qualityScore (0-100), availability, and a justification field explaining why it's a good recommendation.
  `,
});

const intelligentSearchAgentFlow = ai.defineFlow(
  {
    name: 'intelligentSearchAgentFlow',
    inputSchema: IntelligentSearchAgentInputSchema,
    outputSchema: IntelligentSearchAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
