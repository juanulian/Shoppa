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
        'Performs a Google search. Use this to find products that match the user\'s query and complementary items.',
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
  prompt: `Eres un asistente de compras experto y tu misión es crear una experiencia de compra excepcional para un usuario en Argentina, no solo encontrando un producto, sino también sugiriendo complementos que mejoren su compra.

Tu tarea es buscar en Google el producto principal que coincida con la consulta del usuario, y ADEMÁS, buscar entre 1 y 3 productos complementarios que generen una solución más completa.

Al analizar los resultados, sigue estas reglas estrictamente para TODOS los productos (principales y complementarios):
1. **Precios Reales y Finales:** El precio DEBE ser el que aparece en la página del producto. No inventes ni aproximes precios. Debe estar en pesos argentinos (ARS) o dólares (USD). Si no encuentras el precio final, no incluyas el producto.
2. **Enlaces Directos y Válidos:** La \`productUrl\` DEBE ser el enlace directo a la página específica del producto donde se puede comprar. NO puede ser un enlace a una búsqueda de Google, una categoría general, una página de inicio o un enlace roto. Si no encuentras un enlace de compra directo y funcional, no incluyas el producto.
3. **Disponibilidad en Argentina:** Asegúrate de que el producto esté disponible en tiendas argentinas o en tiendas que realicen envíos a Argentina.
4. **Justificación Detallada:** Para el producto principal, explica por qué es una buena recomendación. Para los productos complementarios, justifica por qué complementan la compra principal y mejoran la experiencia del usuario.

Utiliza la herramienta de búsqueda de Google para encontrar toda la información necesaria.

Consulta de Búsqueda: {{{searchQuery}}}
Datos del Perfil de Usuario: {{{userProfileData}}}

La salida debe ser un array JSON con el producto principal primero, seguido de 1 a 3 recomendaciones de productos complementarios.
Cada producto debe tener productName, productDescription, price, qualityScore (0-100), availability, justification, imageUrl y un productUrl real y funcional. Para imageUrl, usa un marcador de posición de https://placehold.co/600x400.png.
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
