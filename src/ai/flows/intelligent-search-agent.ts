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
      description: 'Recupera una lista de celulares disponibles desde la base de datos local.',
      inputSchema: z.void(),
      // Se define un esquema de salida explícito para la herramienta, para que la IA sepa qué esperar.
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
      // Devuelve solo la lista de dispositivos para simplificar
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
  prompt: `Eres un experto recomendador de celulares y tu misión es encontrar los 3 mejores smartphones para el usuario basándote en sus respuestas. Utiliza EXCLUSIVAMENTE el catálogo de productos proporcionado por la herramienta 'getSmartphoneCatalog'.

**PROCESO DE SELECCIÓN OBLIGATORIO:**
1. Llama a la herramienta 'getSmartphoneCatalog' para obtener la lista COMPLETA de celulares disponibles.
2. Analiza profundamente el perfil del usuario, que contiene sus respuestas a preguntas sobre sus necesidades y preferencias (uso, cámara, gaming, presupuesto, etc.).
3. Selecciona los 3 celulares del catálogo que mejor se alineen con el perfil del usuario.
4. Para cada celular seleccionado, debes generar una justificación PERSUASIVA y PERSONALIZADA. No te limites a repetir las especificaciones. Explica POR QUÉ ese celular es ideal para ESE usuario en particular, conectando sus características con las necesidades expresadas por el usuario.

**REGLAS ESTRICTAS - CUMPLIMIENTO OBLIGATORIO:**
1. **USA SOLO EL CATÁLOGO LOCAL:** Solo puedes recomendar celulares que existan en la lista proporcionada por la herramienta 'getSmartphoneCatalog'.
2. **NO INVENTES DATOS:** Todos los datos (modelo, especificaciones, etc.) deben ser exactamente los que están en el catálogo.
3. **JUSTIFICACIÓN PERSUASIVA:** La clave de tu trabajo es la justificación. Debe ser convincente y conectar directamente con las respuestas del usuario. Por ejemplo, si el usuario dijo "me importa mucho la batería", tu justificación debería decir algo como: "Este modelo es perfecto para ti porque su batería de 5000mAh te asegura que llegarás al final del día sin problemas, algo que mencionaste que era muy importante."
4. **RESPETA EL FORMATO DE SALIDA:** La salida debe ser un array JSON con exactamente 3 recomendaciones de productos.
5. **RELLENA TODOS LOS CAMPOS:** Asegúrate de completar todos los campos del esquema de salida (productName, productDescription, price, imageUrl, productUrl, y la importante 'justification'). Usa los datos del catálogo para esto. 'productName' es el modelo, 'price' es 'precio_estimado'. El 'productUrl' puede ser un enlace de búsqueda genérico de Google si no hay uno específico (ej: 'https://www.google.com/search?q=Samsung+Galaxy+S25'). 'availability' debe ser "En stock". 'qualityScore' debe ser un valor estimado entre 70 y 98 basado en la gama y especificaciones. 'productDescription' debe ser un resumen de las especificaciones clave.

**Perfil del Usuario:**
{{{userProfileData}}}

Comienza llamando a 'getSmartphoneCatalog' y luego construye tu recomendación.
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
