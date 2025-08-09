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
import {
  ProductRecommendation,
  ProductRecommendationSchema,
} from '@/ai/schemas/product-recommendation';

const IntelligentSearchAgentInputSchema = z.object({
  searchQuery: z.string().describe('The user search query.'),
  userProfileData: z.string().describe('User profile data collected from onboarding questions.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

export type { ProductRecommendation };

const IntelligentSearchAgentOutputSchema = z.array(ProductRecommendationSchema).describe('A list of product recommendations.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  return intelligentSearchAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  prompt: `Eres un asistente de compras inteligente que encuentra los mejores productos para el usuario en Argentina.
Tu tarea es buscar en Google los productos que coincidan con la consulta de búsqueda del usuario.
Luego, basándote en los resultados de la búsqueda y los datos del perfil del usuario, selecciona los 3-5 mejores productos.
Finalmente, genera una justificación para cada producto explicando por qué es una buena recomendación para el usuario. Considera el precio (en pesos argentinos o dólares), la calidad, la disponibilidad en tiendas argentinas o con envío a Argentina, y la relevancia para el perfil del usuario al hacer las recomendaciones.

Consulta de Búsqueda: {{{searchQuery}}}
Datos del Perfil de Usuario: {{{userProfileData}}}

La salida debe ser un array JSON de recomendaciones de productos.
Cada producto debe tener un productName, productDescription, price, qualityScore (0-100), availability, un campo de justificación explicando por qué es una buena recomendación, y un imageUrl. Para imageUrl, usa un marcador de posición de https://placehold.co/600x400.png.
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
