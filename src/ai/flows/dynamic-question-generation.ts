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
  isAnswerRelevant: z
    .boolean()
    .describe('Indica si la última respuesta del usuario fue relevante y útil para la pregunta formulada.'),
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
  prompt: `Eres un asistente experto en la venta de celulares. Tu objetivo es entender las necesidades del usuario en MÁXIMO 3 preguntas estratégicas para encontrar el celular perfecto. Cada pregunta debe incluir ejemplos claros que guíen al usuario y generen contexto para mejores recomendaciones.

**Tu Estrategia de Solo 3 Preguntas Clave:**

1.  **Pregunta 1 - Uso Principal:** Descubre el propósito principal del celular con ejemplos específicos.
    *   *Formato:* "¿Cuál será tu uso principal? (Ejemplos: fotos profesionales para redes sociales, gaming intenso, apps de trabajo, comunicación básica)"

2.  **Pregunta 2 - Prioridad Principal:** Identifica qué valora más el usuario con opciones claras.
    *   *Formato:* "¿Qué es más importante para ti? (Ejemplos: mejor relación calidad-precio, cámara excepcional, batería que dure todo el día, rendimiento para juegos)"

3.  **Pregunta 3 - Contexto Personal:** Obtén información sobre presupuesto y experiencia previa.
    *   *Formato:* "¿Cuál es tu rango de presupuesto y qué celular usas actualmente? (Ejemplos: hasta $300.000 ARS, vengo de iPhone 12, mi Samsung se quedó lento)"

**Reglas Importantes:**
- SIEMPRE incluye ejemplos específicos entre paréntesis para guiar al usuario
- Haz solo UNA pregunta por vez
- Si ya tienes información sobre un tema, profundiza en aspectos específicos
- Las preguntas deben generar respuestas que permitan identificar el celular perfecto

**Validación de Respuestas:**
Antes de generar nuevas preguntas, debes evaluar la última respuesta del usuario.
- **Respuesta Relevante:** La respuesta tiene sentido en el contexto de la pregunta. Contiene información útil sobre preferencias, usos o características de un celular.
- **Respuesta Irrelevante:** La respuesta es un galimatías (ej: "asdfghjk"), evasiva (ej: "no sé", "dime tú"), o completamente fuera de tema (ej: "me gusta el fútbol cuando me preguntan por la batería").

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
1.  **Analiza la última respuesta del usuario.** Determina si es relevante o no. Asigna 'true' o 'false' al campo \`isAnswerRelevant\`. Si la respuesta no es relevante, no generes nuevas preguntas; devuelve un array vacío.
2.  **Si la respuesta es relevante**, analiza todo el historial. Si las respuestas son vagas (ej: "un celular bueno"), tu prioridad es hacer preguntas que clarifiquen el uso y las prioridades.
3.  **Genera una lista de 1-3 preguntas nuevas**, que no se repitan y que suenen conversacionales, basadas en la estrategia anterior.
4.  **No pidas información que ya se haya proporcionado** en el historial.
5.  **Formula las preguntas usando solo caracteres ASCII estándar**. Evita acentos, tildes, eñes y caracteres especiales. Usa "que", "mas", "como", "telefono" en lugar de "qué", "más", "cómo", "teléfono".
6.  Formula las preguntas en un tono amigable y natural en español.

Ejemplo de buena pregunta: *"Entendido! Y en cuanto a la camara, que valoras mas: un zoom potente para fotos a distancia o una gran calidad en retratos y fotos nocturnas?"*
`,
});

const promptWithFallback = ai.definePrompt({
  name: 'generateFollowUpQuestionsPromptFallback',
  input: {schema: GenerateFollowUpQuestionsInputSchema},
  output: {schema: GenerateFollowUpQuestionsOutputSchema},
  model: 'googleai/gemini-2.5-pro',
  prompt: `Eres un asistente experto en la venta de celulares. Tu objetivo es entender las necesidades del usuario en MÁXIMO 3 preguntas estratégicas para encontrar el celular perfecto. Cada pregunta debe incluir ejemplos claros que guíen al usuario y generen contexto para mejores recomendaciones.

**Tu Estrategia de Solo 3 Preguntas Clave:**

1.  **Pregunta 1 - Uso Principal:** Descubre el propósito principal del celular con ejemplos específicos.
    *   *Formato:* "¿Cuál será tu uso principal? (Ejemplos: fotos profesionales para redes sociales, gaming intenso, apps de trabajo, comunicación básica)"

2.  **Pregunta 2 - Prioridad Principal:** Identifica qué valora más el usuario con opciones claras.
    *   *Formato:* "¿Qué es más importante para ti? (Ejemplos: mejor relación calidad-precio, cámara excepcional, batería que dure todo el día, rendimiento para juegos)"

3.  **Pregunta 3 - Contexto Personal:** Obtén información sobre presupuesto y experiencia previa.
    *   *Formato:* "¿Cuál es tu rango de presupuesto y qué celular usas actualmente? (Ejemplos: hasta $300.000 ARS, vengo de iPhone 12, mi Samsung se quedó lento)"

**Reglas Importantes:**
- SIEMPRE incluye ejemplos específicos entre paréntesis para guiar al usuario
- Haz solo UNA pregunta por vez
- Si ya tienes información sobre un tema, profundiza en aspectos específicos
- Las preguntas deben generar respuestas que permitan identificar el celular perfecto

**Validación de Respuestas:**
Antes de generar nuevas preguntas, debes evaluar la última respuesta del usuario.
- **Respuesta Relevante:** La respuesta tiene sentido en el contexto de la pregunta. Contiene información útil sobre preferencias, usos o características de un celular.
- **Respuesta Irrelevante:** La respuesta es un galimatías (ej: "asdfghjk"), evasiva (ej: "no sé", "dime tú"), o completamente fuera de tema (ej: "me gusta el fútbol cuando me preguntan por la batería").

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
1.  **Analiza la última respuesta del usuario.** Determina si es relevante o no. Asigna 'true' o 'false' al campo \`isAnswerRelevant\`. Si la respuesta no es relevante, no generes nuevas preguntas; devuelve un array vacío.
2.  **Si la respuesta es relevante**, analiza todo el historial. Si las respuestas son vagas (ej: "un celular bueno"), tu prioridad es hacer preguntas que clarifiquen el uso y las prioridades.
3.  **Genera una lista de 1-3 preguntas nuevas**, que no se repitan y que suenen conversacionales, basadas en la estrategia anterior.
4.  **No pidas información que ya se haya proporcionado** en el historial.
5.  **Formula las preguntas usando solo caracteres ASCII estándar**. Evita acentos, tildes, eñes y caracteres especiales. Usa "que", "mas", "como", "telefono" en lugar de "qué", "más", "cómo", "teléfono".
6.  Formula las preguntas en un tono amigable y natural en español.

Ejemplo de buena pregunta: *"Entendido! Y en cuanto a la camara, que valoras mas: un zoom potente para fotos a distancia o una gran calidad en retratos y fotos nocturnas?"*
`,
});

const generateFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpQuestionsFlow',
    inputSchema: GenerateFollowUpQuestionsInputSchema,
    outputSchema: GenerateFollowUpQuestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.warn('Gemini 2.5 Flash falló en preguntas, usando Gemini 2.5 Pro como fallback:', error);
      const {output} = await promptWithFallback(input);
      return output!;
    }
  }
);
