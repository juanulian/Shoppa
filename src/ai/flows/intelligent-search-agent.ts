'use server';

/**
 * @fileOverview An intelligent search agent that finds the best product options based on the search query and user profile data by searching the web.
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

const googleSearchTool = ai.defineTool(
    {
      name: 'googleSearch',
      description:
        'Performs a Google search. Use this to find products that match the user\'s query.',
      inputSchema: z.any(),
      outputSchema: z.any(),
    },
    async (input: any) => input
  );

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  tools: [googleSearchTool],
  prompt: `Eres un asistente de compras experto y tu misión es encontrar las mejores ofertas REALES para un usuario en Argentina.
Tu tarea es buscar en Google los productos que coincidan con la consulta del usuario. Es crucial que utilices la herramienta de búsqueda para obtener información actualizada.

Al analizar los resultados, sigue estas reglas estrictamente:
1. **Precios Reales:** El precio DEBE ser el que aparece en la página del producto. No inventes precios. Debe estar en pesos argentinos (ARS) o dólares (USD). Si no encuentras el precio, no incluyas el producto.
2. **Enlaces Reales:** La \`productUrl\` DEBE ser el enlace directo a la página del producto donde se puede comprar, no un enlace a una búsqueda de Google o a una categoría general. Si no encuentras un enlace de compra directo, no incluyas el producto.
3. **Disponibilidad en Argentina:** Asegúrate de que el producto esté disponible en tiendas argentinas o en tiendas que realicen envíos a Argentina.
4. **Justificación Detallada:** Explica por qué cada producto es una buena recomendación, basándote en la información que encontraste y en el perfil del usuario.

Utiliza la herramienta de búsqueda de Google para encontrar la información necesaria.

Consulta de Búsqueda: {{{searchQuery}}}
Datos del Perfil de Usuario: {{{userProfileData}}}

La salida debe ser un array JSON de 3 a 5 recomendaciones de productos.
Cada producto debe tener productName, productDescription, price, qualityScore (0-100), availability, justification, imageUrl y un productUrl real. Para imageUrl, usa un marcador de posición de https://placehold.co/600x400.png.
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
