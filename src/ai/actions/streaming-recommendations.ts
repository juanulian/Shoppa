'use server';

import { ProductRecommendation } from '@/ai/schemas/product-recommendation';
import { smartphonesDatabase } from '@/lib/smartphones-database';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ProductRecommendationSchema } from '@/ai/schemas/product-recommendation';

// Tool to get smartphone catalog
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
);

// Schema for single recommendation input
const SingleRecommendationInputSchema = z.object({
  userProfileData: z.string(),
  recommendationNumber: z.number(),
});

// Prompt for single recommendation
const singleRecommendationPrompt = ai.definePrompt({
  name: 'singleRecommendationPrompt',
  input: { schema: SingleRecommendationInputSchema },
  output: { schema: ProductRecommendationSchema },
  tools: [getSmartphoneCatalog],
  model: 'googleai/gemini-2.5-flash',
  system: `Eres el motor de recomendaciones de Shoppa!

**TU TAREA:**
Genera UNA SOLA recomendación de celular basándote en el perfil del usuario.

**REGLAS:**

1. **CATALOGO PRIMERO:**
   - Llama 'getSmartphoneCatalog' para obtener productos disponibles
   - Solo recomienda productos del catálogo

2. **PRIORIZACIÓN:**
   - Recomendación #1: LA MEJOR coincidencia (máximo match con presupuesto y necesidades)
   - Recomendación #2: Segunda mejor opción (alternativa valiosa, diferente ángulo)
   - Recomendación #3: Tercera opción (balance precio/features)

3. **PRESUPUESTO:**
   - 90% dentro del presupuesto del usuario
   - Si excedes: justifica el valor extra

4. **COMUNICACIÓN STEVE JOBS:**
   - CERO especificaciones técnicas (GB, mAh, megapíxeles, procesadores)
   - Habla de EXPERIENCIAS: "súper rápido", "batería todo el día", "fotos increíbles"
   - Simple y claro como para abuela de 80 años

5. **CAMPOS OBLIGATORIOS:**
   - productName: Del catálogo (model)
   - price: Del catálogo (precio_estimado)
   - imageUrl: Del catálogo (image_url)
   - productUrl: Google search
   - availability: "En stock"
   - qualityScore: 70-98
   - productDescription: Beneficios, no specs
   - justification: Por qué este para ESTE usuario
   - matchPercentage: 65-98%
   - matchTags: 2-4 tags (high/medium/low)`,
  prompt: `**Perfil del Usuario:**
{{{userProfileData}}}

**Número de Recomendación:** {{{recommendationNumber}}}

Genera la recomendación #{{{recommendationNumber}}} para este usuario. Lenguaje simple, enfocado en experiencias, respetando presupuesto.`,
});

// Pre-filter catalog
function preFilterCatalog(userProfile: string, fullCatalog: typeof smartphonesDatabase.devices) {
  const profileLower = userProfile.toLowerCase();

  const keywords = {
    brands: ['iphone', 'samsung', 'xiaomi', 'motorola', 'google', 'pixel'],
  };

  const preferredBrands = keywords.brands.filter(brand => profileLower.includes(brand));
  const isPremium = profileLower.includes('premium') || profileLower.includes('mejor') || profileLower.includes('gama alta');
  const isBudget = profileLower.includes('economico') || profileLower.includes('barato') || profileLower.includes('accesible');

  let filtered = fullCatalog;

  if (preferredBrands.length > 0) {
    filtered = filtered.filter(device =>
      device?.name && preferredBrands.some(brand => device.name.toLowerCase().includes(brand))
    );
  }

  if (isBudget) {
    filtered = filtered.filter(device => {
      if (!device?.price) return false;
      const price = parseFloat(device.price.replace(/[^0-9.]/g, ''));
      return price < 600;
    });
  } else if (isPremium) {
    filtered = filtered.filter(device => {
      if (!device?.price) return false;
      const price = parseFloat(device.price.replace(/[^0-9.]/g, ''));
      return price > 800;
    });
  }

  if (filtered.length < 5) {
    filtered = fullCatalog.slice(0, 15);
  }

  filtered = filtered.slice(0, 15);

  console.log(`📊 Pre-filtrado: ${fullCatalog.length} → ${filtered.length} productos`);
  return filtered;
}

// Generate single recommendation
async function generateSingleRecommendation(
  userProfileData: string,
  recommendationNumber: number
): Promise<ProductRecommendation> {
  console.log(`🤖 Generando recomendación #${recommendationNumber}...`);

  const fullCatalog = smartphonesDatabase.devices;
  const filteredCatalog = preFilterCatalog(userProfileData, fullCatalog);

  const originalCatalog = smartphonesDatabase.devices;
  (smartphonesDatabase as any).devices = filteredCatalog;

  try {
    const { output } = await singleRecommendationPrompt({
      userProfileData,
      recommendationNumber,
    });
    console.log(`✅ Recomendación #${recommendationNumber} lista`);
    return output!;
  } finally {
    (smartphonesDatabase as any).devices = originalCatalog;
  }
}

// Server action that returns recommendations one by one
export async function getRecommendationAtIndex(userProfileData: string, index: number): Promise<ProductRecommendation> {
  return generateSingleRecommendation(userProfileData, index + 1);
}
