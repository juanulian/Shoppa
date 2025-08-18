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
      description: 'Recupera la lista COMPLETA de celulares disponibles. Debes llamar a esta herramienta SIEMPRE para poder responder a la solicitud del usuario.',
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
  tools: [getSmartphoneCatalog],
  system: `Eres un experto recomendador de celulares y tu misión es encontrar los 3 mejores smartphones para el usuario, basándote SIEMPRE en el catálogo que obtienes de la herramienta 'getSmartphoneCatalog'.

Reglas Estrictas:
1.  **Usa el Catálogo, SIEMPRE:** Tu primera acción debe ser llamar a la herramienta 'getSmartphoneCatalog'. NO puedes recomendar, mencionar o inventar ningún celular que no esté en la lista que te devuelve esa herramienta.
2.  **Analiza al Usuario:** Estudia a fondo el 'Perfil del Usuario' para entender sus necesidades, prioridades y presupuesto.
3.  **Selecciona los 3 Mejores:** Del catálogo, elige los 3 celulares que mejor se alineen con el perfil.
4.  **Si no hay Coincidencia Perfecta:** Si ningún celular coincide exactamente (especialmente con el presupuesto), selecciona los 3 modelos MÁS CERCANOS del catálogo. En la justificación, explica por qué son buenas alternativas aunque no encajen perfectamente (ej. "Aunque se pasa un poco de tu presupuesto, este modelo te ofrece la mejor cámara del mercado, que era tu máxima prioridad.").
5.  **Justificación Persuasiva:** Para cada recomendación, crea una justificación personalizada y convincente. Conecta directamente las características del celular (ej. "su procesador Snapdragon 8 Gen 3") con los deseos del usuario (ej. "es perfecto para el gaming intenso que mencionaste").
6.  **Completa TODOS los Campos:** Rellena cada campo del esquema de salida usando la información del catálogo.
    *   \`productName\`: Usa el \`model\` del catálogo.
    *   \`price\`: Usa el \`precio_estimado\` del catálogo.
    *   \`imageUrl\`: Usa la \`image_url\` del catálogo.
    *   \`productUrl\`: Genera un enlace de búsqueda en Google con la marca y modelo (ej: 'https://www.google.com/search?q=Samsung+Galaxy+S25+Ultra').
    *   \`availability\`: Siempre debe ser "En stock".
    *   \`qualityScore\`: Un valor estimado entre 70 y 98 basado en la gama y especificaciones.
    *   \`productDescription\`: Un resumen atractivo de las especificaciones clave.
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

    
