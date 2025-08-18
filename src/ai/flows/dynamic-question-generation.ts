'use server';

/**
 * @fileOverview Flujo de generación de preguntas dinámicas para la incorporación de nuevos usuarios interesados en celulares.
 *
 * - generateFollowUpQuestions - Una función que genera preguntas de seguimiento basadas en la respuesta inicial del usuario y preguntas anteriores.
 * - GenerateFollowUpQuestionsInput - El tipo de entrada para la función generateFollowUpQuestions.
 * - GenerateFollowUpQuestionsOutput - El tipo de retorno para la función generateFollowUpQuestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpQuestionsInputSchema = z.object({
  initialAnswer: z.string().describe('La respuesta inicial del usuario a la pregunta de incorporación.'),
  priorQuestionsAndAnswers: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .describe('Una lista de preguntas y respuestas previas en el flujo de incorporation.'),
});
export type GenerateFollowUpQuestionsInput = z.infer<typeof GenerateFollowUpQuestionsInputSchema>;

const GenerateFollowUpQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('Una lista de 1 a 3 preguntas de seguimiento.'),
});
export type GenerateFollowUpQuestionsOutput = z.infer<typeof GenerateFollowUpQuestionsOutputSchema>;

export async function generateFollowUpQuestions(
  input: GenerateFollowUpQuestionsInput
): Promise<GenerateFollowUpQuestionsOutput> {
  return generateFollowUpQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpQuestionsPrompt',
  input: {schema: GenerateFollowUpQuestionsInputSchema},
  output: {schema: GenerateFollowUpQuestionsOutputSchema},
  prompt: `Eres un asistente experto en la venta de celulares. Tu objetivo es entender las necesidades del usuario haciendo preguntas de seguimiento perspicaces. Basándote en la conversación hasta ahora, genera de 1 a 3 nuevas preguntas para obtener la información más relevante y encontrar el celular perfecto. La moneda de referencia es Pesos Argentinos (ARS).

**Tu Estrategia de Preguntas (Enfocada en Celulares):**
Tus preguntas deben descubrir información clave en estas áreas:

1.  **Uso Principal:** ¿Para qué usará principalmente el celular?
    *   *Ejemplos:* ¿Es para trabajo (emails, apps de productividad), para gaming intenso, para crear contenido (fotos, videos), o para un uso más básico (redes sociales, WhatsApp)?
2.  **Prioridades Clave:** ¿Qué es lo más importante para el usuario?
    *   *Ejemplos:* ¿El presupuesto en ARS es lo más importante? ¿O prefiere la mejor cámara posible, la mayor duración de batería, el rendimiento más rápido para juegos, o una pantalla de alta calidad para ver videos?
3.  **Experiencias Pasadas y Ecosistema:** ¿Qué celular ha usado antes?
    *   *Ejemplos:* ¿Qué le gustó o no le gustó de su celular anterior? ¿Usa otros productos de alguna marca específica (Apple, Samsung)? ¿Está buscando cambiarse de Android a iPhone o viceversa?
4.  **Características Específicas:** Si el usuario ya mencionó un uso, profundiza en las especificaciones.
    *   *Ejemplo si dice "para fotos":* "¿Buscas hacer fotos profesionales con control manual o prefieres una cámara que tome fotos geniales de forma automática y sencilla?"
    *   *Ejemplo si dice "para jugar":* "¿Te importa más que los juegos se vean con los gráficos al máximo o que el celular no se caliente y la batería dure mucho?"

**Historial de la Conversación:**
*Pregunta Inicial:* "¿Qué tipo de celular estás buscando hoy?"
*Respuesta Inicial:* {{{initialAnswer}}}

{{#if priorQuestionsAndAnswers}}
*Preguntas y Respuestas de Seguimiento:*
{{#each priorQuestionsAndAnswers}}
P: {{{this.question}}}
R: {{{this.answer}}}
{{/each}}
{{/if}}

**Tu Tarea:**
- Analiza las respuestas del usuario. Si son vagas (ej: "un celular bueno"), tu prioridad es hacer preguntas que clarifiquen el uso y las prioridades.
- Genera una lista de 1-3 preguntas nuevas, que no se repitan y que suenen conversacionales, basadas en la estrategia anterior.
- No pidas información que ya se haya proporcionado en el historial.
- Formula las preguntas en un tono amigable y natural en español.
- Devuelve las preguntas como un array JSON de strings.

Ejemplo de buena pregunta: *"¡Entendido! Y en cuanto a la cámara, ¿qué valoras más: un zoom potente para fotos a distancia o una gran calidad en retratos y fotos nocturnas?"*
`,
});

const generateFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpQuestionsFlow',
    inputSchema: GenerateFollowUpQuestionsInputSchema,
    outputSchema: GenerateFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
