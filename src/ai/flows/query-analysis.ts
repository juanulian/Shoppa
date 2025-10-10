'use server';

/**
 * @fileOverview Análisis semántico de búsquedas del usuario para determinar qué información falta
 * y qué preguntas hacer en el onboarding.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QueryAnalysisInputSchema = z.object({
  query: z.string().describe('La búsqueda o input inicial del usuario desde la landing.'),
});
export type QueryAnalysisInput = z.infer<typeof QueryAnalysisInputSchema>;

const QueryAnalysisOutputSchema = z.object({
  detected: z.object({
    brand: z.string().nullable().describe('Marca detectada: iPhone, Samsung, Xiaomi, Motorola, Google Pixel, etc.'),
    model: z.string().nullable().describe('Modelo específico detectado: 16 Pro, S24 Ultra, etc.'),
    useCase: z.array(z.string()).describe('Usos detectados: fotos, gaming, trabajo, básico, redes sociales'),
    priority: z.array(z.string()).describe('Prioridades técnicas: batería, cámara, velocidad, precio, almacenamiento'),
    budget: z.string().nullable().describe('Presupuesto: económico/medio/premium o monto específico'),
    special: z.string().nullable().describe('Necesidades especiales: reacondicionado, resistente al agua, dual SIM, etc.'),
  }),
  missing: z.array(z.enum(['useCase', 'priority', 'budget'])).describe('Qué información falta y debe preguntarse'),
  isComplete: z.boolean().describe('Si tiene suficiente información para hacer recomendaciones directas'),
});
export type QueryAnalysisOutput = z.infer<typeof QueryAnalysisOutputSchema>;

export async function analyzeQuery(input: QueryAnalysisInput): Promise<QueryAnalysisOutput> {
  return analyzeQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeQueryPrompt',
  input: {schema: QueryAnalysisInputSchema},
  output: {schema: QueryAnalysisOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  system: `Eres un analizador semántico de búsquedas de celulares.

**TU TAREA:**
Extraer información estructurada del input del usuario para determinar qué falta preguntar.

**REGLAS DE EXTRACCIÓN:**

1. **SOLO extrae lo EXPLÍCITO:**
   - Si NO está mencionado directamente → null o array vacío
   - NO inferir ni asumir
   - NO inventar información

2. **brand:** Detectar marca específica
   - Válidos: "iPhone", "Samsung", "Xiaomi", "Motorola", "Google Pixel", "Realme", "OPPO", "Huawei"
   - Si dice genérico ("celular", "smartphone") → null

3. **model:** Detectar modelo específico
   - Ejemplos: "16 Pro", "S24 Ultra", "Redmi Note 13"
   - Solo si menciona modelo exacto

4. **useCase:** Array de usos detectados
   - Válidos: "fotos", "gaming", "trabajo", "básico", "redes sociales", "videos", "streaming"
   - Ejemplos:
     * "para fotos" → ["fotos"]
     * "trabajo y fotos" → ["trabajo", "fotos"]
     * "solo WhatsApp" → ["básico"]

5. **priority:** Array de prioridades técnicas
   - Válidos: "batería", "cámara", "velocidad", "precio", "almacenamiento", "pantalla"
   - Ejemplos:
     * "que dure todo el día" → ["batería"]
     * "buena cámara y rápido" → ["cámara", "velocidad"]
     * "el más barato" → ["precio"]

6. **budget:** Rango de presupuesto
   - Clasificación: "económico" | "medio" | "premium"
   - O monto específico: "AR$200.000", "USD 500"
   - Inferir de palabras clave:
     * "barato", "económico", "accesible" → "económico"
     * "gama media", "equilibrado" → "medio"
     * "premium", "lo mejor", "sin límite" → "premium"

7. **special:** Necesidades especiales
   - Ejemplos: "reacondicionado", "resistente al agua", "dual SIM", "carga rápida", "5G"

**CRITERIO DE COMPLETITUD:**

\`isComplete = true\` SI tiene AL MENOS 2 de:
- brand O model
- useCase (al menos 1)
- priority (al menos 1)
- budget

**missing:** Array de lo que falta preguntar:
- Si no tiene useCase → incluir "useCase"
- Si no tiene priority → incluir "priority"
- Si no tiene budget → incluir "budget"
- Orden de prioridad: budget > useCase > priority

**EJEMPLOS:**

Input: "iPhone 16 económico"
→ brand: "iPhone", model: "16", budget: "económico"
→ missing: ["useCase", "priority"]
→ isComplete: false

Input: "celular para fotos y gaming, gama alta"
→ useCase: ["fotos", "gaming"], budget: "premium"
→ missing: []
→ isComplete: true

Input: "Samsung con buena batería"
→ brand: "Samsung", priority: ["batería"]
→ missing: ["useCase", "budget"]
→ isComplete: false

Input: "celular bueno"
→ Todo vacío
→ missing: ["useCase", "priority", "budget"]
→ isComplete: false`,

  prompt: `Analiza esta búsqueda y extrae información estructurada:

"{{{query}}}"

Recuerda: SOLO extrae lo explícito. No inventes.`,
});

const analyzeQueryFlow = ai.defineFlow(
  {
    name: 'analyzeQueryFlow',
    inputSchema: QueryAnalysisInputSchema,
    outputSchema: QueryAnalysisOutputSchema,
  },
  async input => {
    console.log('🔍 Analizando query:', input.query);
    const {output} = await prompt(input);
    console.log('✅ Análisis completo:', output);
    return output!;
  }
);
