'use server';

/**
 * @fileOverview Un agente de búsqueda inteligente que encuentra las mejores opciones de celulares basándose en los datos del usuario y un catálogo local.
 *
 * - intelligentSearchAgent - Una función que maneja el proceso de recomendación de celulares.
 * - IntelligentSearchAgentInput - El tipo de entrada para la función intelligentSearchAgent.
 * - IntelligentSearchAgentOutput - El tipo de retorno para la función intelligentSearchAgent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ProductRecommendation,
  ProductRecommendationSchema,
} from '@/ai/schemas/product-recommendation';
import { smartphonesDatabase } from '@/lib/smartphones-database';


const getSmartphoneCatalog = ai.defineTool(
    {
      name: 'getSmartphoneCatalog',
      description: 'Recupera una lista de celulares disponibles desde la base de datos local para responder a la solicitud del usuario.',
      inputSchema: z.void(),
      outputSchema: z.array(z.object({
        id: z.string(),
        brand: z.string(),
        model: z.string(),
        storage: z.string(),
        image_url: z.string(),
        gama: z.string(),
        precio_estimado: z.string(),
        uso_recomendado: z.array(z.string()),
        especificaciones: z.any(),
        durabilidad: z.any(),
        ideal_para: z.array(z.string()),
      })),
    },
    async () => {
      return smartphonesDatabase.devices;
    }
  )

const IntelligentSearchAgentInputSchema = z.object({
  userProfileData: z.string().describe('Datos del perfil de usuario recopilados de las preguntas de incorporación.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

export type { ProductRecommendation };

const IntelligentSearchAgentOutputSchema = z.array(ProductRecommendationSchema).describe('Una lista de 3 recomendaciones de celulares.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  return intelligentSearchAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  tools: [getSmartphoneCatalog, ai.tool.googleSearch()],
  system: `Eres un experto recomendador de celulares y tu misión es encontrar los 3 mejores smartphones para el usuario.
- Debes usar la herramienta 'getSmartphoneCatalog' para obtener el catálogo de celulares y basar tus recomendaciones exclusivamente en esa lista.
- Analiza profundamente el perfil del usuario para entender sus necesidades.
- Selecciona los 3 celulares del catálogo que mejor se alineen con el perfil del usuario.
- Para cada celular, genera una justificación PERSUASIVA y PERSONALIZADA, explicando POR QUÉ es ideal para ESE usuario, conectando sus características con las necesidades expresadas.
- Rellena todos los campos del esquema de salida usando los datos del catálogo.
- 'productName' es el modelo, 'price' es 'precio_estimado'.
- 'productUrl' puede ser un enlace de búsqueda de Google si no hay uno específico.
- 'availability' debe ser "En stock".
- 'qualityScore' debe ser un valor estimado entre 70 y 98 basado en la gama y especificaciones.
- 'productDescription' debe ser un resumen de las especificaciones clave.
`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}
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
