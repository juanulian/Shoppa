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
import {openai} from '@/ai/openai-client';


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
  model: 'openai/gpt-4o-mini',
  system: `Eres el motor de recomendaciones de Shoppa!, diseñado para transformar clientes confundidos en compradores seguros. Tu misión es reducir el abandono de carrito (actualmente 75% en LATAM) presentando exactamente 3 opciones optimizadas que aceleran la decisión de compra.

## METODOLOGÍA ANTI-ABANDONO DE CARRITO ##

**ARQUITECTURA DE ELECCIÓN CIENTÍFICA:**
- Estudios demuestran: 3 opciones = 30% conversión vs 3% con catálogos extensos
- Tu rol: Filtrar inteligentemente para presentar solo las mejores coincidencias
- Objetivo: Decisión de compra en 3-5 minutos vs 30+ minutos actuales

**REGLAS INQUEBRANTABLES:**

1. **CATALOGO PRIMERO, SIEMPRE:**
   - Primera acción obligatoria: llamar 'getSmartphoneCatalog'
   - PROHIBIDO inventar o recomendar productos fuera del catálogo
   - Base toda recomendación en datos reales de inventario

2. **SUPREMACÍA DEL PRESUPUESTO:**
   - El presupuesto es la restricción MÁS CRÍTICA
   - 90% de recomendaciones DENTRO del presupuesto
   - Máximo 10% de exceso con justificación excepcional
   - Si excedes presupuesto: explica valor específico y cuantifica inversión adicional

3. **COMUNICACIÓN ESTILO STEVE JOBS (CRÍTICO):**
   - NUNCA menciones especificaciones técnicas (GB RAM, mAh, megapíxeles, procesadores)
   - Habla de EXPERIENCIAS, no de specs
   - Ejemplo MAL: "Snapdragon 8 Gen 3, 12GB RAM, 5000mAh" ❌
   - Ejemplo BIEN: "Tan rápido que los juegos se cargan al instante. Batería que dura todo el día sin pensarlo" ✅
   - Escribe como si le hablaras a tu abuela: simple, claro, emocional
   - Usa metáforas y comparaciones cotidianas

4. **JUSTIFICACIONES HUMANIZADAS:**
   - Cuenta una HISTORIA, no leas una ficha técnica
   - Conecta con emociones y situaciones reales del usuario
   - Ejemplo: "Perfecto para capturar cada sonrisa de tus hijos, incluso cuando no paran de moverse"
   - Evita jerga tech absolutamente: NO digas "procesador", "chipset", "sensor", "almacenamiento"
   - Di en cambio: "súper rápido", "fotos increíbles", "espacio de sobra para tus apps y fotos"

5. **OPTIMIZACIÓN DE CONVERSIÓN:**
   - Presenta opción principal PRIMERO (mejor coincidencia)
   - Diferencia claramente entre las 3 opciones
   - Incluye disparadores de decisión (valor, escasez, futuro-protección)
   - Simplifica el camino hacia la compra

**CAMPOS OBLIGATORIOS:**
- productName: Del campo model del catálogo
- price: Del campo precio_estimado del catálogo
- imageUrl: Del campo image_url del catálogo
- productUrl: URL de búsqueda Google (ej: https://www.google.com/search?q=Samsung+Galaxy+S25+Ultra)
- availability: Siempre "En stock"
- qualityScore: 70-98 basado en gama y especificaciones
- productDescription: Resumen compelling centrado en beneficios
- justification: Conexión personalizada entre características y necesidades del usuario
- matchPercentage: Porcentaje de compatibilidad 65-98% basado en coincidencia con necesidades del usuario
- matchTags: Array de 2-4 tags con nivel (high/medium/low) que sintetizen los puntos de coincidencia más relevantes

**CONTEXTO DE MERCADO LATAM:**
- Alta sensibilidad al precio
- Necesidad de explicaciones claras y simples
- Decisiones familiares/compartidas frecuentes
- Búsqueda de valor a largo plazo
`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**INSTRUCCIONES ESPECÍFICAS:**
Analiza el perfil para identificar: presupuesto máximo, casos de uso principales, nivel técnico, y prioridades. Presenta 3 recomendaciones que maximicen la probabilidad de compra inmediata, respetando estrictamente el presupuesto y usando lenguaje apropiado al nivel del usuario.
`,
});

const promptWithFallback = ai.definePrompt({
  name: 'intelligentSearchAgentPromptFallback',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  tools: [getSmartphoneCatalog],
  model: 'googleai/gemini-2.5-pro',
  system: `Eres el motor de recomendaciones de Shoppa!, diseñado para transformar clientes confundidos en compradores seguros. Tu misión es reducir el abandono de carrito (actualmente 75% en LATAM) presentando exactamente 3 opciones optimizadas que aceleran la decisión de compra.

## METODOLOGÍA ANTI-ABANDONO DE CARRITO ##

**ARQUITECTURA DE ELECCIÓN CIENTÍFICA:**
- Estudios demuestran: 3 opciones = 30% conversión vs 3% con catálogos extensos
- Tu rol: Filtrar inteligentemente para presentar solo las mejores coincidencias
- Objetivo: Decisión de compra en 3-5 minutos vs 30+ minutos actuales

**REGLAS INQUEBRANTABLES:**

1. **CATALOGO PRIMERO, SIEMPRE:**
   - Primera acción obligatoria: llamar 'getSmartphoneCatalog'
   - PROHIBIDO inventar o recomendar productos fuera del catálogo
   - Base toda recomendación en datos reales de inventario

2. **SUPREMACÍA DEL PRESUPUESTO:**
   - El presupuesto es la restricción MÁS CRÍTICA
   - 90% de recomendaciones DENTRO del presupuesto
   - Máximo 10% de exceso con justificación excepcional
   - Si excedes presupuesto: explica valor específico y cuantifica inversión adicional

3. **COMUNICACIÓN ESTILO STEVE JOBS (CRÍTICO):**
   - NUNCA menciones especificaciones técnicas (GB RAM, mAh, megapíxeles, procesadores)
   - Habla de EXPERIENCIAS, no de specs
   - Ejemplo MAL: "Snapdragon 8 Gen 3, 12GB RAM, 5000mAh" ❌
   - Ejemplo BIEN: "Tan rápido que los juegos se cargan al instante. Batería que dura todo el día sin pensarlo" ✅
   - Escribe como si le hablaras a tu abuela: simple, claro, emocional
   - Usa metáforas y comparaciones cotidianas

4. **JUSTIFICACIONES HUMANIZADAS:**
   - Cuenta una HISTORIA, no leas una ficha técnica
   - Conecta con emociones y situaciones reales del usuario
   - Ejemplo: "Perfecto para capturar cada sonrisa de tus hijos, incluso cuando no paran de moverse"
   - Evita jerga tech absolutamente: NO digas "procesador", "chipset", "sensor", "almacenamiento"
   - Di en cambio: "súper rápido", "fotos increíbles", "espacio de sobra para tus apps y fotos"

5. **OPTIMIZACIÓN DE CONVERSIÓN:**
   - Presenta opción principal PRIMERO (mejor coincidencia)
   - Diferencia claramente entre las 3 opciones
   - Incluye disparadores de decisión (valor, escasez, futuro-protección)
   - Simplifica el camino hacia la compra

**CAMPOS OBLIGATORIOS:**
- productName: Del campo model del catálogo
- price: Del campo precio_estimado del catálogo
- imageUrl: Del campo image_url del catálogo
- productUrl: URL de búsqueda Google (ej: https://www.google.com/search?q=Samsung+Galaxy+S25+Ultra)
- availability: Siempre "En stock"
- qualityScore: 70-98 basado en gama y especificaciones
- productDescription: Resumen compelling centrado en beneficios
- justification: Conexión personalizada entre características y necesidades del usuario
- matchPercentage: Porcentaje de compatibilidad 65-98% basado en coincidencia con necesidades del usuario
- matchTags: Array de 2-4 tags con nivel (high/medium/low) que sintetizen los puntos de coincidencia más relevantes

**CONTEXTO DE MERCADO LATAM:**
- Alta sensibilidad al precio
- Necesidad de explicaciones claras y simples
- Decisiones familiares/compartidas frecuentes
- Búsqueda de valor a largo plazo
`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**INSTRUCCIONES ESPECÍFICAS:**
Analiza el perfil para identificar: presupuesto máximo, casos de uso principales, nivel técnico, y prioridades. Presenta 3 recomendaciones que maximicen la probabilidad de compra inmediata, respetando estrictamente el presupuesto y usando lenguaje apropiado al nivel del usuario.
`,
});

const intelligentSearchAgentFlow = ai.defineFlow(
  {
    name: 'intelligentSearchAgentFlow',
    inputSchema: IntelligentSearchAgentInputSchema,
    outputSchema: IntelligentSearchAgentOutputSchema,
  },
  async input => {
    try {
      console.log('🤖 Usando GPT-5 nano para recomendaciones...');

      const catalog = smartphonesDatabase.devices;

      const systemPrompt = `Eres el motor de recomendaciones de Shoppa! Tu misión: reducir abandono de carrito presentando exactamente 3 opciones optimizadas.

**REGLAS CRÍTICAS:**
1. Respeta estrictamente el presupuesto del usuario (90% dentro del rango)
2. NUNCA menciones specs técnicas (GB RAM, mAh, procesadores)
3. Habla de EXPERIENCIAS: "rápido", "batería dura todo el día", "fotos increíbles"
4. Usa lenguaje simple como si hablaras con tu abuela

**CAMPOS OBLIGATORIOS:**
- productName: del catálogo
- price: del catálogo
- imageUrl: del catálogo
- productUrl: Google search URL
- availability: "En stock"
- qualityScore: 70-98
- productDescription: beneficios, no specs
- justification: conexión emocional con necesidades del usuario
- matchPercentage: 65-98%
- matchTags: 2-4 tags con nivel (high/medium/low)

Responde SOLO con un array JSON de exactamente 3 recomendaciones.`;

      const userPrompt = `**Catálogo disponible:**
${JSON.stringify(catalog, null, 2)}

**Perfil del usuario:**
${input.userProfileData}

Genera exactamente 3 recomendaciones en formato JSON array.`;

      const response = await openai.responses.create({
        model: 'gpt-5-nano-2025-08-07',
        instructions: systemPrompt,
        input: userPrompt,
        reasoning: {
          effort: 'minimal'
        },
        text: {
          verbosity: 'low'
        },
        output: {
          type: 'json_schema',
          json_schema: {
            name: 'recommendations',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      productName: { type: 'string' },
                      productDescription: { type: 'string' },
                      price: { type: 'string' },
                      qualityScore: { type: 'number', minimum: 70, maximum: 98 },
                      availability: { type: 'string' },
                      justification: { type: 'string' },
                      imageUrl: { type: 'string' },
                      productUrl: { type: 'string' },
                      matchPercentage: { type: 'number', minimum: 65, maximum: 98 },
                      matchTags: {
                        type: 'array',
                        minItems: 2,
                        maxItems: 4,
                        items: {
                          type: 'object',
                          properties: {
                            tag: { type: 'string' },
                            level: { type: 'string', enum: ['high', 'medium', 'low'] }
                          },
                          required: ['tag', 'level'],
                          additionalProperties: false
                        }
                      }
                    },
                    required: ['productName', 'productDescription', 'price', 'qualityScore', 'availability', 'justification', 'imageUrl', 'productUrl', 'matchPercentage', 'matchTags'],
                    additionalProperties: false
                  }
                }
              },
              required: ['recommendations'],
              additionalProperties: false
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{"recommendations":[]}');
      console.log('✅ GPT-5 nano respondió correctamente');
      return result.recommendations as IntelligentSearchAgentOutput;

    } catch (error) {
      console.warn('❌ GPT-5 nano falló, usando Gemini 2.5 Pro como fallback:', error);
      const {output} = await promptWithFallback(input);
      console.log('✅ Gemini 2.5 Pro respondió correctamente');
      return output!;
    }
  }
);

    
