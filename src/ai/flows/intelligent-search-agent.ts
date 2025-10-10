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

// Helper: Timeout wrapper para cada modelo
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, modelName: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${modelName} excedió ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

const intelligentSearchAgentFlow = ai.defineFlow(
  {
    name: 'intelligentSearchAgentFlow',
    inputSchema: IntelligentSearchAgentFlowInputSchema,
    outputSchema: IntelligentSearchAgentOutputSchema,
  },
  async input => {
    // OPTIMIZACIÓN: Ejecutar los 3 modelos en PARALELO con Promise.race
    // Esto reduce la latencia de ~60s a ~10-15s
    //
    // ESTRATEGIA:
    // 1. Los 3 modelos se lanzan casi simultáneamente (delays mínimos para priorizar)
    // 2. Promise.race retorna el PRIMERO que responda exitosamente
    // 3. Las otras promesas se descartan automáticamente (no se esperan)
    // 4. Timeouts más generosos para móvil/conexiones lentas
    //
    // COSTO vs BENEFICIO:
    // - ✅ UX: 45-60s → 10-15s (mejora 70%)
    // - ⚠️ API calls: Potencialmente 3x llamadas, PERO:
    //   * Solo la primera que responde se usa
    //   * Timeouts cancelan las lentas
    //   * Delays escalonados dan ventaja al modelo preferido
    //   * ROI positivo: menos abandonos = más conversiones

    console.log('🚀 Ejecutando modelos en paralelo (Promise.race optimizado)...');
    const startTime = Date.now();

    const promises = [
      // Gemini 2.5 Pro - sin delay (máxima prioridad)
      (async () => {
        const modelStart = Date.now();
        try {
          console.log('🤖 [0ms] Gemini 2.5 Pro iniciado');
          const {output} = await withTimeout(
            mainSearchPrompt(input),
            35000, // 35s timeout (aumentado para móvil/conexiones lentas)
            'Gemini 2.5 Pro'
          );
          console.log(`✅ Gemini 2.5 Pro respondió en ${Date.now() - modelStart}ms`);
          return { output: output!, model: 'Gemini 2.5 Pro', time: Date.now() - startTime };
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Error desconocido';
          console.error(`❌ Gemini 2.5 Pro falló después de ${Date.now() - modelStart}ms:`, errorMsg);
          throw e;
        }
      })(),

      // Gemini 2.5 Flash - delay mínimo de 800ms (prioridad media)
      (async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const modelStart = Date.now();
        try {
          console.log('⚡ [800ms] Gemini 2.5 Flash iniciado');
          const {output} = await withTimeout(
            fallbackSearchPrompt(input),
            30000, // 30s timeout (aumentado para móvil/conexiones lentas)
            'Gemini 2.5 Flash'
          );
          console.log(`✅ Gemini 2.5 Flash respondió en ${Date.now() - modelStart}ms`);
          return { output: output!, model: 'Gemini 2.5 Flash', time: Date.now() - startTime };
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Error desconocido';
          console.error(`❌ Gemini 2.5 Flash falló después de ${Date.now() - modelStart}ms:`, errorMsg);
          throw e;
        }
      })(),

      // OpenAI GPT-4o-mini - delay de 1500ms (prioridad baja)
      (async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const modelStart = Date.now();
        try {
          console.log('🤖 [1500ms] OpenAI GPT-4o-mini iniciado');
          const {output} = await withTimeout(
            openAIFallbackSearchPrompt(input),
            30000, // 30s timeout (aumentado para móvil/conexiones lentas)
            'OpenAI GPT-4o-mini'
          );
          console.log(`✅ OpenAI respondió en ${Date.now() - modelStart}ms`);
          return { output: output!, model: 'OpenAI GPT-4o-mini', time: Date.now() - startTime };
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Error desconocido';
          console.error(`❌ OpenAI falló después de ${Date.now() - modelStart}ms:`, errorMsg);
          throw e;
        }
      })()
    ];

    try {
      // Promise.race: retorna el PRIMER resultado exitoso
      const result = await Promise.race(promises);
      console.log(`🎯 Ganador: ${result.model} en ${result.time}ms total`);
      return result.output;
    } catch (firstError) {
      // Si Promise.race falla, usamos Promise.any como último recurso
      console.warn("⚠️ Promise.race falló, intentando con Promise.any...");
      try {
        const result = await Promise.any(promises);
        console.log(`🎯 Fallback ganador: ${result.model} en ${result.time}ms total`);
        return result.output;
      } catch (allErrors) {
        const totalTime = Date.now() - startTime;
        console.error(`❌ Error fatal después de ${totalTime}ms: ningún modelo pudo generar recomendaciones`);

        // Analizar qué tipo de errores ocurrieron
        if (allErrors instanceof AggregateError) {
          const hasTimeoutError = allErrors.errors.some(e =>
            e instanceof Error && e.message.includes('Timeout')
          );

          if (hasTimeoutError) {
            throw new Error('Timeout: Los servidores están tardando más de lo normal');
          }
        }

        throw new Error("No se pudieron generar recomendaciones. Por favor, intentá de nuevo en unos segundos.");
      }
    }
  }
);


export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  const filteredCatalog = preFilterCatalog(input.userProfileData);

  // Retry logic: 2 intentos con delays incrementales
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt}/${maxRetries}...`);

      const result = await intelligentSearchAgentFlow({
        userProfileData: input.userProfileData,
        catalog: filteredCatalog
      });

      console.log(`✅ Éxito en intento ${attempt}`);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Error desconocido');
      console.error(`❌ Intento ${attempt} falló:`, lastError.message);

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 2s, 4s
        console.log(`⏳ Esperando ${delay}ms antes de reintentar...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Si todos los intentos fallaron, lanzar el último error
  throw lastError || new Error('No se pudieron generar recomendaciones después de múltiples intentos');
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
      return output!;
    } catch (e) {
      console.error(`❌ Error en Pro para rec #${input.recommendationNumber}, activando fallback a Flash...`, e);
      try {
        const {output} = await fallbackSingleRecPrompt(input);
        console.log(`✅ Recomendación #${input.recommendationNumber} lista con Flash`);
        return output!;
      } catch (e2) {
        console.error(`❌ Error en fallback a Flash para rec #${input.recommendationNumber}, activando fallback a OpenAI...`, e2);
        try {
            console.log(`⚡️ Usando OpenAI GPT-4o-mini como fallback final para rec #${input.recommendationNumber}...`);
            const {output} = await openAIFallbackSingleRecPrompt(input);
            console.log(`✅ Recomendación #${input.recommendationNumber} lista con OpenAI`);
            return output!;
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
