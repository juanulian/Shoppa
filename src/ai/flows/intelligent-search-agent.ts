'use server';

/**
 * @fileOverview An intelligent search agent that finds the best product options based on the search query and user profile data by searching the web.
 *
 * - intelligentSearchAgent - A function that handles the product search process.
 * - IntelligentSearchAgentInput - The input type for the intelligentSearchAgent function.
 * - IntelligentSearchAgentOutput - The return type for the intelligentSearchAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ProductRecommendation,
  ProductRecommendationSchema,
} from '@/ai/schemas/product-recommendation';

const IntelligentSearchAgentInputSchema = z.object({
  searchQuery: z.string().describe('The user search query.'),
  userProfileData: z.string().describe('User profile data collected from onboarding questions.'),
});
export type IntelligentSearchAgentInput = z.infer<typeof IntelligentSearchAgentInputSchema>;

export type { ProductRecommendation };

const ProductOptionSchema = z.object({
  mainProduct: ProductRecommendationSchema,
  complementaryProducts: z.array(ProductRecommendationSchema).describe('A list of 1 to 3 complementary products for the main product.'),
});

const IntelligentSearchAgentOutputSchema = z.array(ProductOptionSchema).describe('A list of 2 to 4 product options.');
export type IntelligentSearchAgentOutput = z.infer<typeof IntelligentSearchAgentOutputSchema>;

export async function intelligentSearchAgent(input: IntelligentSearchAgentInput): Promise<IntelligentSearchAgentOutput> {
  return intelligentSearchAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchAgentPrompt',
  input: {schema: IntelligentSearchAgentInputSchema},
  output: {schema: IntelligentSearchAgentOutputSchema},
  tools: ['googleSearch'],
  prompt: `Eres un asistente de compras experto y tu misión es crear una experiencia de compra excepcional para un usuario en Argentina. Tu objetivo es encontrar entre 2 y 4 opciones de productos principales excelentes que coincidan con su búsqueda.

Para CADA UNA de estas opciones principales, debes ADEMÁS buscar entre 1 y 3 productos complementarios que generen una solución más completa y atractiva.

**PROCESO DE BÚSQUEDA OBLIGATORIO:**
1. Realiza búsquedas exhaustivas en Google para cada producto usando la herramienta 'googleSearch'.
2. Visita las páginas de productos específicas para obtener información real y verificable.
3. Extrae ÚNICAMENTE datos que puedas verificar directamente de las páginas web.

**REGLAS ESTRICTAS - CUMPLIMIENTO OBLIGATORIO PARA TODOS LOS PRODUCTOS:**

1. **PRECIOS REALES Y VERIFICADOS:**
   - El precio DEBE ser el precio exacto que aparece en la página del producto.
   - DEBE estar en ARS (pesos argentinos) o USD (dólares).
   - Si la página muestra el precio en otra moneda, conviértelo a ARS.
   - **PROHIBIDO:** Inventar, aproximar o suponer precios.
   - **SI NO ENCUENTRAS EL PRECIO REAL:** Descarta ese producto y busca otro.

2. **ENLACES DIRECTOS DE COMPRA:**
   - La productUrl DEBE llevar directamente a la página específica del producto.
   - El enlace debe permitir agregar el producto al carrito o comprarlo.
   - **ENLACES PROHIBIDOS:**
     * Enlaces de búsqueda de Google.
     * Enlaces a categorías generales.
     * Enlaces a páginas de inicio.
     * Enlaces rotos o inválidos.
   - **SI NO ENCUENTRAS UN ENLACE DIRECTO:** Descarta ese producto y busca otro.

3. **IMÁGENES REALES DEL PRODUCTO:**
   - La imageUrl DEBE ser la URL de la imagen real del producto.
   - Extrae la imagen principal que aparece en la página del producto.
   - La imagen debe ser de alta calidad y mostrar claramente el producto.
   - **PROHIBIDO:** Usar imágenes de marcador de posición o placeholder.
   - **SI NO ENCUENTRAS LA IMAGEN REAL:** Descarta ese producto y busca otro.

4. **DISPONIBILIDAD EN ARGENTINA:**
   - Verifica que el producto esté disponible en:
     * Tiendas argentinas (MercadoLibre, Fravega, Garbarino, etc.).
     * O tiendas internacionales que envíen a Argentina.
   - Confirma el stock o disponibilidad actual.
   - **SI NO ESTÁ DISPONIBLE EN ARGENTINA:** Descarta ese producto y busca otro.

5. **INFORMACIÓN COMPLETA Y VERIFICADA:**
   - productName: Nombre exacto del producto como aparece en la tienda.
   - productDescription: Descripción real basada en la información de la página.
   - qualityScore: Calificación basada en reviews reales (0-100).
   - availability: Estado real del stock ("En stock", "Últimas unidades", etc.).
   - justification: Explicación detallada de por qué recomiendas este producto.

**CRITERIO DE DESCARTE:**
Si un producto NO cumple con TODOS los requisitos anteriores (precio real, enlace directo, imagen real, disponibilidad en Argentina), NO lo incluyas en los resultados. Es mejor devolver menos productos pero con información 100% verificada que inventar datos.

**VALIDACIÓN FINAL:**
Antes de devolver los resultados, verifica que:
- Cada URL funcione y lleve al producto específico.
- Cada precio sea el real y actual.
- Cada imagen sea la real del producto.
- Todo esté disponible para compra en Argentina.

Consulta de Búsqueda: {{{searchQuery}}}
Datos del Perfil de Usuario: {{{userProfileData}}}

La salida debe ser un array JSON donde cada elemento representa una opción de compra. Cada opción debe contener un 'mainProduct' y una lista de 'complementaryProducts'.

**IMPORTANTE:** Solo incluye productos que cumplan con TODAS las reglas. Si no puedes verificar algún dato, NO incluyas ese producto.
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
