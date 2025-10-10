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

// Define the tool statically at the top level.
const getSmartphoneCatalogTool = ai.defineTool(
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
    // The tool now directly accesses the imported database.
    return smartphonesDatabase.devices;
  }
);


const IntelligentSearchAgentInputSchema = z.object({
  userProfileData: z.string().describe('Datos del perfil de usuario recopilados de las preguntas de incorporación.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

export type { ProductRecommendation };

const IntelligentSearchAgentOutputSchema = z.array(ProductRecommendationSchema).describe('Una lista de 3 recomendaciones de celulares.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

const SingleRecommendationInputSchema = z.object({
  userProfileData: z.string().describe('Datos del perfil de usuario recopilados de las preguntas de incorporación.'),
  recommendationNumber: z.number().describe('Número de recomendación (1, 2, o 3)'),
  previousRecommendations: z.array(ProductRecommendationSchema).optional().describe('Recomendaciones previas para evitar duplicados'),
});


// Helper to create prompts
function createIntelligentSearchPrompt(model: 'googleai/gemini-2.5-pro' | 'googleai/gemini-2.5-flash') {
  return ai.definePrompt({
    name: `intelligentSearchAgentPrompt_${model.replace(/[^a-zA-Z0-9]/g, '_')}`,
    input: {schema: IntelligentSearchAgentInputSchema},
    output: {schema: IntelligentSearchAgentOutputSchema},
    model,
    tools: [getSmartphoneCatalogTool], // Statically assign the tool
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
- matchTags: Array de 2-4 tags. IMPORTANTE: Para el campo 'icon', debes elegir uno de los valores permitidos en el schema. NO inventes iconos.
`,
    prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**INSTRUCCIONES ESPECÍFICAS:**
Analiza el perfil para identificar: presupuesto máximo, casos de uso principales, nivel técnico, y prioridades. Presenta 3 recomendaciones que maximicen la probabilidad de compra inmediata, respetando estrictamente el presupuesto y usando lenguaje apropiado al nivel del usuario.
`,
  });
}

// Define prompts outside the flow
const mainSearchPrompt = createIntelligentSearchPrompt('googleai/gemini-2.5-pro');
const fallbackSearchPrompt = createIntelligentSearchPrompt('googleai/gemini-2.5-flash');

const intelligentSearchAgentFlow = ai.defineFlow(
  {
    name: 'intelligentSearchAgentFlow',
    inputSchema: IntelligentSearchAgentInputSchema,
    outputSchema: IntelligentSearchAgentOutputSchema,
  },
  async input => {
    try {
        console.log('🤖 Usando Gemini 2.5 Pro para recomendaciones...');
        const {output} = await mainSearchPrompt(input);
        console.log('✅ Gemini 2.5 Pro respondió correctamente');
        return output!;
    } catch (e) {
        console.error("❌ Error en Gemini 2.5 Pro, activando fallback...", e);
        try {
          console.log('⚡️ Usando Gemini 2.5 Flash como fallback...');
          const {output} = await fallbackSearchPrompt(input);
          console.log('✅ Gemini 2.5 Flash respondió correctamente');
          return output!;
        } catch (e2) {
          console.error("❌ Error en el fallback a Gemini 2.5 Flash.", e2);
          throw e2; // Re-throw the error if fallback also fails
        }
    }
  }
);


export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  const filteredCatalog = preFilterCatalog(input.userProfileData);
  
  // This is a temporary workaround to pass the filtered catalog to the tool.
  // A better approach would be to pass filter parameters to the tool itself.
  const originalDevices = smartphonesDatabase.devices;
  (smartphonesDatabase as any).devices = filteredCatalog;

  try {
    return await intelligentSearchAgentFlow(input);
  } finally {
    // IMPORTANT: Restore the original database to avoid side effects.
    (smartphonesDatabase as any).devices = originalDevices;
  }
}


function createSingleRecommendationPrompt(model: 'googleai/gemini-2.5-pro' | 'googleai/gemini-2.5-flash') {
  return ai.definePrompt({
    name: `singleRecommendationPrompt_${model.replace(/[^a-zA-Z0-9]/g, '_')}`,
    input: {schema: SingleRecommendationInputSchema},
    output: {schema: ProductRecommendationSchema},
    model,
    tools: [getSmartphoneCatalogTool], // Statically assign the tool
    system: `Eres el motor de recomendaciones de Shoppa!, diseñado para transformar clientes confundidos en compradores seguros.

**TU TAREA:**
Genera UNA SOLA recomendación de celular basándote en el perfil del usuario y el número de recomendación solicitado.

**REGLAS:**

1. **CATALOGO PRIMERO:**
   - Llama 'getSmartphoneCatalog' para obtener productos disponibles
   - Solo recomienda productos del catálogo

2. **PRIORIZACIÓN POR NÚMERO:**
   - Recomendación #1: LA MEJOR coincidencia (máximo match con presupuesto y necesidades)
   - Recomendación #2: Segunda mejor opción (alternativa valiosa, diferente ángulo)
   - Recomendación #3: Tercera opción (balance precio/features o stretch option)

3. **PRESUPUESTO:**
   - 90% de recomendaciones DENTRO del presupuesto del usuario
   - Si excedes: justifica el valor extra específicamente

4. **COMUNICACIÓN STEVE JOBS:**
   - CERO especificaciones técnicas (GB, mAh, megapíxeles, procesadores)
   - Habla de EXPERIENCIAS: "súper rápido", "batería todo el día", "fotos increíbles"
   - Simple y claro como para tu abuela de 80 años

5. **CAMPOS OBLIGATORIOS:**
   - productName: Del catálogo (campo model)
   - price: Del catálogo (campo precio_estimado)
   - imageUrl: Del catálogo (campo image_url)
   - productUrl: Google search (ej: https://www.google.com/search?q=Samsung+Galaxy+S25+Ultra)
   - availability: "En stock"
   - qualityScore: 70-98
   - productDescription: Beneficios, no specs
   - justification: Por qué este para ESTE usuario
   - matchPercentage: 65-98%
   - matchTags: Array de 2-4 tags. IMPORTANTE: Para el campo 'icon', debes elegir uno de los valores permitidos en el schema. NO inventes iconos.`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**Número de Recomendación:** {{{recommendationNumber}}}

Genera la recomendación #{{{recommendationNumber}}} para este usuario. Recuerda: lenguaje simple, enfocado en experiencias, respetando presupuesto.`,
  });
}

// Define single recommendation prompts outside the flow
const mainSingleRecPrompt = createSingleRecommendationPrompt('googleai/gemini-2.5-pro');
const fallbackSingleRecPrompt = createSingleRecommendationPrompt('googleai/gemini-2.5-flash');

const generateSingleRecommendationFlow = ai.defineFlow(
  {
    name: 'generateSingleRecommendationFlow',
    inputSchema: SingleRecommendationInputSchema,
    outputSchema: ProductRecommendationSchema,
  },
  async input => {
    console.log(`🤖 Generando recomendación #${input.recommendationNumber}...`);
    try {
      const {output} = await mainSingleRecPrompt(input);
      console.log(`✅ Recomendación #${input.recommendationNumber} lista con Pro`);
      return output!;
    } catch (e) {
      console.error(`❌ Error en Pro para rec #${input.recommendationNumber}, activando fallback...`, e);
      try {
        const {output} = await fallbackSingleRecPrompt(input);
        console.log(`✅ Recomendación #${input.recommendationNumber} lista con Flash`);
        return output!;
      } catch (e2) {
        console.error(`❌ Error en fallback para rec #${input.recommendationNumber}`, e2);
        throw e2;
      }
    }
  }
);


// Streaming version - generates recommendations in parallel and yields as soon as ready
export async function* intelligentSearchAgentStreaming(input: IntelligentSearchAgentInput): AsyncGenerator<ProductRecommendation, void, unknown> {
  const filteredCatalog = preFilterCatalog(input.userProfileData);

  // This is a temporary workaround to pass the filtered catalog to the tool.
  const originalDevices = smartphonesDatabase.devices;
  (smartphonesDatabase as any).devices = filteredCatalog;
  
  try {
    // Create 3 promises that generate recommendations in parallel
    const promises = [1, 2, 3].map((num) =>
      generateSingleRecommendationFlow({
        userProfileData: input.userProfileData,
        recommendationNumber: num,
        previousRecommendations: [],
      })
    );

    // Yield recommendations as soon as ANY is ready using Promise.race properly
    const completed = new Set<number>();

    while (completed.size < 3) {
      // Wrap each pending promise with its index
      const indexed = promises
        .map((p, i) => completed.has(i) ? null : p.then(rec => ({ index: i, rec })))
        .filter(Boolean) as Promise<{index: number, rec: ProductRecommendation}>[];

      if (indexed.length === 0) break;

      // Wait for the first one to complete
      const { index, rec } = await Promise.race(indexed);

      // Mark as completed and yield
      completed.add(index);
      yield rec;
    }
  } finally {
    // IMPORTANT: Restore the original database to avoid side effects.
    (smartphonesDatabase as any).devices = originalDevices;
  }
}

// Pre-filter catalog based on user profile to reduce input size and latency
function preFilterCatalog(userProfile: string) {
  const fullCatalog = smartphonesDatabase.devices;
  const profileLower = userProfile.toLowerCase();

  // Extract budget from profile
  const budgetMatch = profileLower.match(/(\d+)\s*(usd|dolares|pesos)/i);
  let maxBudget = budgetMatch ? parseInt(budgetMatch[1]) : null;

  // Extract keywords
  const keywords = {
    brands: ['iphone', 'samsung', 'xiaomi', 'motorola', 'google', 'pixel'],
  };

  const preferredBrands = keywords.brands.filter(brand => profileLower.includes(brand));
  const isPremium = profileLower.includes('premium') || profileLower.includes('mejor') || profileLower.includes('gama alta');
  const isBudget = profileLower.includes('economico') || profileLower.includes('barato') || profileLower.includes('accesible');

  let filtered = fullCatalog;

  // Brand filter
  if (preferredBrands.length > 0) {
    filtered = filtered.filter(device =>
      device?.model && preferredBrands.some(brand => device.model.toLowerCase().includes(brand))
    );
  }

  // Budget filter (más agresivo)
  if (maxBudget) {
    filtered = filtered.filter(device => {
      if (!device?.precio_estimado) return false;
      const price = parseFloat(device.precio_estimado.replace(/[^0-9.]/g, ''));
      return price <= maxBudget * 1.15; // Allow 15% over budget
    });
  } else if (isBudget) {
    filtered = filtered.filter(device => {
      if (!device?.precio_estimado) return false;
      const price = parseFloat(device.precio_estimado.replace(/[^0-9.]/g, ''));
      return price < 500;
    });
  } else if (isPremium) {
    filtered = filtered.filter(device => {
      if (!device?.precio_estimado) return false;
      const price = parseFloat(device.precio_estimado.replace(/[^0-9.]/g, ''));
      return price > 800;
    });
  }

  // If filtered too much, get diverse sample
  if (filtered.length < 5) {
    filtered = fullCatalog.slice(0, 10);
  } else if (filtered.length > 10) {
    // Reduce to 10 for faster processing
    filtered = filtered.slice(0, 10);
  }

  console.log(`📊 Pre-filtrado: ${fullCatalog.length} → ${filtered.length} productos`);
  return filtered;
}
