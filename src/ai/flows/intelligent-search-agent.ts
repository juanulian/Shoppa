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
  normalizeProductRecommendation,
} from '@/ai/schemas/product-recommendation';
import { smartphonesDatabase } from '@/lib/smartphones-database';

const CatalogItemSchema = z.object({
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
});
type CatalogItem = z.infer<typeof CatalogItemSchema>;

const IntelligentSearchAgentFlowInputSchema = z.object({
  userProfileData: z.string().describe('Datos del perfil de usuario recopilados de las preguntas de incorporación.'),
  catalog: z.array(CatalogItemSchema).describe('El catálogo de productos pre-filtrado para la búsqueda.'),
});
type IntelligentSearchAgentFlowInput = z.infer<typeof IntelligentSearchAgentFlowInputSchema>;


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
function createIntelligentSearchPrompt(model: 'googleai/gemini-2.5-pro' | 'googleai/gemini-2.5-flash' | 'openai/gpt-4o-mini') {
  return ai.definePrompt({
    name: `intelligentSearchAgentPrompt_${model.replace(/[^a-zA-Z0-9]/g, '_')}`,
    input: {schema: IntelligentSearchAgentFlowInputSchema},
    output: {schema: IntelligentSearchAgentOutputSchema},
    model,
    tools: [
      ai.defineTool(
        {
          name: 'getSmartphoneCatalog',
          description: 'Recupera la lista COMPLETA de celulares disponibles. Debes llamar a esta herramienta SIEMPRE para poder responder a la solicitud del usuario.',
          inputSchema: z.void(),
          outputSchema: z.array(CatalogItemSchema),
        },
        async () => {
          // Este tool retorna el catálogo que se pasa en el prompt
          // El catálogo real viene del input del prompt vía {{{json catalog}}}
          return smartphonesDatabase.devices;
        }
      ),
    ],
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
- matchTags: Array de 2-4 tags PREDEFINIDOS del listado. REGLAS CRÍTICAS:
  * Elegir tags que reflejen HONESTAMENTE qué tan bien el producto cumple cada aspecto
  * "Máxima Velocidad" / "Súper Rápido" = SIEMPRE high (verde) - solo para flagships con procesadores top
  * "Buen Rendimiento" = medium (amarillo) - gama media
  * "Rendimiento Básico" = low (rojo) - gama baja
  * "Cámara Pro" / "Fotos Excelentes" = SIEMPRE high (verde) - solo para celulares con cámaras excepcionales
  * "Excelente Precio" = high (verde) - producto barato con buenas specs
  * "Precio Elevado" = low (rojo) - producto caro (puede ser justificado si es premium)
  * El nivel (color) debe COINCIDIR con el tag: no poner "Máxima Velocidad" en amarillo/rojo
  * Usar el icono correcto automáticamente según el tag elegido
`,
    prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**Catálogo de Productos Disponibles:**
{{{json catalog}}}

**INSTRUCCIONES ESPECÍFICAS:**
Analiza el perfil para identificar: presupuesto máximo, casos de uso principales, nivel técnico, y prioridades. Presenta 3 recomendaciones que maximicen la probabilidad de compra inmediata, respetando estrictamente el presupuesto y usando lenguaje apropiado al nivel del usuario.
`,
  });
}

// Define prompts outside the flow
const mainSearchPrompt = createIntelligentSearchPrompt('googleai/gemini-2.5-pro');
const fallbackSearchPrompt = createIntelligentSearchPrompt('googleai/gemini-2.5-flash');
const openAIFallbackSearchPrompt = createIntelligentSearchPrompt('openai/gpt-4o-mini');

const intelligentSearchAgentFlow = ai.defineFlow(
  {
    name: 'intelligentSearchAgentFlow',
    inputSchema: IntelligentSearchAgentFlowInputSchema,
    outputSchema: IntelligentSearchAgentOutputSchema,
  },
  async input => {
    try {
      console.log('🤖 Usando Gemini 2.5 Pro para generar recomendaciones...');
      const {output} = await mainSearchPrompt(input);
      console.log('✅ Gemini 2.5 Pro respondió correctamente');
      return output!;
    } catch (e) {
      console.error("❌ Error en Gemini 2.5 Pro, activando fallback a Gemini Flash...", e);
      try {
        console.log('⚡️ Usando Gemini 2.5 Flash como fallback...');
        const {output} = await fallbackSearchPrompt(input);
        console.log('✅ Gemini 2.5 Flash respondió correctamente');
        return output!;
      } catch (e2) {
        console.error("❌ Error en el fallback a Gemini 2.5 Flash, activando fallback a OpenAI...", e2);
        try {
            console.log('⚡️ Usando OpenAI GPT-4o-mini como fallback final...');
            const {output} = await openAIFallbackSearchPrompt(input);
            console.log('✅ OpenAI respondió correctamente');
            return output!;
        } catch (e3) {
            console.error("❌ Error en el fallback final a OpenAI.", e3);
            throw e3;
        }
      }
    }
  }
);


export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  const filteredCatalog = preFilterCatalog(input.userProfileData);

  // 🚀 OPTIMIZACIÓN: 3 modelos en paralelo, 1 recomendación cada uno
  console.log('🚀 Generando 3 recomendaciones en paralelo...');

  const models: Array<'googleai/gemini-2.5-pro' | 'googleai/gemini-2.5-flash' | 'openai/gpt-4o-mini'> = [
    'googleai/gemini-2.5-pro',
    'googleai/gemini-2.5-flash',
    'openai/gpt-4o-mini',
  ];

  const modelNames = ['Gemini Pro', 'Gemini Flash', 'OpenAI'];

  // Función para generar 1 recomendación con fallback
  const generateWithFallback = async (primaryModel: typeof models[number], fallbackModels: typeof models[number][], index: number) => {
    const allModels = [primaryModel, ...fallbackModels];

    for (let i = 0; i < allModels.length; i++) {
      const model = allModels[i];
      const modelName = model.includes('pro') ? 'Gemini Pro' : model.includes('flash') ? 'Gemini Flash' : 'OpenAI';

      try {
        console.log(`  → ${modelName} generando recomendación #${index}...`);
        const prompt = createSingleRecommendationPrompt(model);

        // Timeout de 30 segundos por modelo
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout de 30s')), 30000)
        );

        const resultPromise = prompt({
          userProfileData: input.userProfileData,
          recommendationNumber: index,
        });

        const { output } = await Promise.race([resultPromise, timeoutPromise]) as any;

        console.log(`  ✅ ${modelName} completó recomendación #${index}`);
        return output;
      } catch (error: any) {
        const errorMsg = error.message || 'Error desconocido';
        console.error(`  ❌ ${modelName} falló para recomendación #${index}:`, errorMsg);

        if (i === allModels.length - 1) {
          // Último modelo falló, lanzar error detallado
          throw new Error(`Todos los modelos fallaron para recomendación #${index}. Último error: ${errorMsg}`);
        }
        console.log(`  ⚡ Intentando fallback con siguiente modelo...`);
      }
    }

    // Nunca debería llegar aquí, pero TypeScript lo requiere
    throw new Error(`Error inesperado en recomendación #${index}`);
  };

  // Distribuir modelos para 3 recomendaciones con fallbacks
  const promises = [
    generateWithFallback(models[0], [models[1], models[2]], 1), // Pro → Flash → OpenAI
    generateWithFallback(models[1], [models[2], models[0]], 2), // Flash → OpenAI → Pro
    generateWithFallback(models[2], [models[1], models[0]], 3), // OpenAI → Flash → Pro
  ];

  // Ejecutar en paralelo
  const results = await Promise.all(promises);

  // Filtrar nulls/undefined y normalizar
  return results
    .filter((result): result is NonNullable<typeof result> => result != null)
    .map(normalizeProductRecommendation);
}


function createSingleRecommendationPrompt(model: 'googleai/gemini-2.5-pro' | 'googleai/gemini-2.5-flash' | 'openai/gpt-4o-mini') {
  return ai.definePrompt({
    name: `singleRecommendationPrompt_${model.replace(/[^a-zA-Z0-9]/g, '_')}`,
    input: {schema: SingleRecommendationInputSchema},
    output: {schema: ProductRecommendationSchema},
    model,
    tools: [ai.defineTool(
      {
        name: 'getSmartphoneCatalog',
        description: 'Recupera la lista COMPLETA de celulares disponibles. Debes llamar a esta herramienta SIEMPRE para poder responder a la solicitud del usuario.',
        inputSchema: z.void(),
        outputSchema: z.array(CatalogItemSchema),
      },
      async () => {
        return smartphonesDatabase.devices;
      }
    )],
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
   - matchTags: Array de 2-4 tags PREDEFINIDOS. REGLAS:
     * "Máxima Velocidad"/"Súper Rápido" = SIEMPRE high (verde) - solo flagships
     * "Cámara Pro"/"Fotos Excelentes" = SIEMPRE high (verde) - solo cámaras top
     * El nivel debe coincidir con el tag: no "Máxima Velocidad" en amarillo
     * Icono automático según tag`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**Número de Recomendación:** {{{recommendationNumber}}}

Genera la recomendación #{{{recommendationNumber}}} para este usuario. Recuerda: lenguaje simple, enfocado en experiencias, respetando presupuesto.`,
  });
}

// Define single recommendation prompts outside the flow
const mainSingleRecPrompt = createSingleRecommendationPrompt('googleai/gemini-2.5-pro');
const fallbackSingleRecPrompt = createSingleRecommendationPrompt('googleai/gemini-2.5-flash');
const openAIFallbackSingleRecPrompt = createSingleRecommendationPrompt('openai/gpt-4o-mini');


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
      return normalizeProductRecommendation(output!);
    } catch (e) {
      console.error(`❌ Error en Pro para rec #${input.recommendationNumber}, activando fallback a Flash...`, e);
      try {
        const {output} = await fallbackSingleRecPrompt(input);
        console.log(`✅ Recomendación #${input.recommendationNumber} lista con Flash`);
        return normalizeProductRecommendation(output!);
      } catch (e2) {
        console.error(`❌ Error en fallback a Flash para rec #${input.recommendationNumber}, activando fallback a OpenAI...`, e2);
        try {
            console.log(`⚡️ Usando OpenAI GPT-4o-mini como fallback final para rec #${input.recommendationNumber}...`);
            const {output} = await openAIFallbackSingleRecPrompt(input);
            console.log(`✅ Recomendación #${input.recommendationNumber} lista con OpenAI`);
            return normalizeProductRecommendation(output!);
        } catch(e3) {
            console.error(`❌ Error en el fallback final a OpenAI para rec #${input.recommendationNumber}`, e3);
            throw e3;
        }
      }
    }
  }
);


// Streaming version - generates recommendations in parallel and yields as soon as ready
export async function* intelligentSearchAgentStreaming(input: IntelligentSearchAgentInput): AsyncGenerator<ProductRecommendation, void, unknown> {
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
  const isBudget = profileLower.includes('económico') || profileLower.includes('barato') || profileLower.includes('accesible');

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

  // OPTIMIZACIÓN: Reducir catálogo más agresivamente
  // 5-8 productos son suficientes para generar 3 recomendaciones de calidad
  if (filtered.length < 5) {
    // Si filtramos demasiado, tomar muestra diversa
    filtered = fullCatalog.slice(0, 8);
  } else if (filtered.length > 8) {
    // Reducir a 8 para procesamiento más rápido
    // IMPORTANTE: Esto reduce tokens enviados al LLM significativamente
    filtered = filtered.slice(0, 8);
  }

  console.log(`📊 Pre-filtrado: ${fullCatalog.length} → ${filtered.length} productos (optimizado para velocidad)`);
  return filtered;
}
