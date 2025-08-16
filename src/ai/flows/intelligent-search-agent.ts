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
import { demoProducts } from '@/lib/demo-products';


const getLocalProducts = ai.defineTool(
    {
      name: 'getLocalProducts',
      description: 'Retrieves a list of available products from the local demo file.',
      inputSchema: z.void(),
      outputSchema: z.array(ProductRecommendationSchema),
    },
    async () => {
      return demoProducts;
    }
  )


const IntelligentSearchAgentInputSchema = z.object({
  searchQuery: z.string().describe('The user search query.'),
  userProfileData: z.string().describe('User profile data collected from onboarding questions.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

export type { ProductRecommendation };

const ProductOptionSchema = z.object({
  mainProduct: ProductRecommendationSchema,
  complementaryProducts: z.array(ProductRecommendationSchema).describe('A list of 1 to 3 complementary products for the main product.'),
});

const IntelligentSearchAgentOutputSchema = z.array(ProductOptionSchema).describe('A list of 2 to 4 product options.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  return intelligentSearchAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  tools: [getLocalProducts],
  prompt: `Eres un asistente de compras experto y tu misión es crear una experiencia de compra excepcional para un usuario en Argentina. Tu objetivo es seleccionar entre 2 y 4 opciones de productos principales excelentes que coincidan con su búsqueda, utilizando la lista de productos disponibles que te proporciona la herramienta 'getLocalProducts'.

Para CADA UNA de estas opciones principales, debes ADEMÁS seleccionar entre 1 y 3 productos complementarios de la misma lista que generen una solución más completa y atractiva.

**PROCESO DE SELECCIÓN OBLIGATORIO:**
1. Llama a la herramienta 'getLocalProducts' para obtener la lista completa de productos disponibles para la demo.
2. Analiza la consulta de búsqueda del usuario y su perfil.
3. Filtra y selecciona los productos más relevantes de la lista. No inventes productos que no estén en la lista.
4. Para cada producto principal, elige productos complementarios lógicos de la misma lista.
5. Justifica tus recomendaciones basándote en la consulta del usuario y los datos del producto.

**REGLAS ESTRICTAS - CUMPLIMIENTO OBLIGATORIO:**
1. **USA SOLO PRODUCTOS LOCALES:** Solo puedes recomendar productos que existan en la lista proporcionada por la herramienta 'getLocalProducts'.
2. **NO INVENTES DATOS:** Todos los datos (nombre, precio, descripción, URL, etc.) deben ser exactamente los que están en el archivo local. No los modifiques.
3. **SÉ CREATIVO CON LAS RECOMENDACIONES:** Aunque la lista de productos es fija, tu valor está en cómo combinas el producto principal con los complementarios y cómo justificas la elección para el usuario.
4. **RESPETA EL FORMATO DE SALIDA:** La salida debe ser un array JSON donde cada elemento representa una opción de compra. Cada opción debe contener un 'mainProduct' y una lista de 'complementaryProducts'.

Consulta de Búsqueda: {{{searchQuery}}}
Datos del Perfil de Usuario: {{{userProfileData}}}

Comienza llamando a 'getLocalProducts' y luego construye tu recomendación.
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
