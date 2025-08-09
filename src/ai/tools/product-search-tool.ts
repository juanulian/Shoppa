'use server';

/**
 * @fileOverview Defines a Genkit tool for searching products in the catalog.
 */

import { ai } from '@/ai/genkit';
import { searchProducts, Product } from '@/services/product-service';
import { z } from 'genkit';

const ProductSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query for products.'),
});

const ProductSearchOutputSchema = z.array(
    z.object({
        productName: z.string(),
        productDescription: z.string(),
        price: z.number(),
        qualityScore: z.number(),
        availability: z.string(),
        category: z.string(),
        imageUrl: z.string(),
    })
);


export const productSearchTool = ai.defineTool(
  {
    name: 'productSearchTool',
    description: 'Searches the product catalog for items matching the user\'s query. Returns a list of products.',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    console.log(`Searching for products with query: ${input.query}`);
    const results = await searchProducts(input.query);
    console.log(`Found ${results.length} products.`);
    return results;
  }
);
