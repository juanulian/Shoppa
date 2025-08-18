/**
 * @fileOverview Defines the Zod schema for a product recommendation.
 */
import { z } from 'zod';

export const ProductRecommendationSchema = z.object({
  productName: z.string().describe('El nombre del celular (ej. "Galaxy S25 Ultra").'),
  productDescription: z.string().describe('Una breve descripción de las características clave del celular en español.'),
  price: z.string().describe('El precio o rango de precio estimado del celular.'),
  qualityScore: z.number().describe('Un puntaje que representa la calidad del producto (0-100), puede ser un valor estimado.'),
  availability: z.string().describe('La disponibilidad del producto (ej. "En stock").'),
  justification: z.string().describe('Justificación persuasiva y personalizada de por qué se recomienda este celular al usuario, basada en sus respuestas.'),
  imageUrl: z.string().describe('Una URL a una imagen del producto.'),
  productUrl: z.string().describe('La URL a la página del producto para su compra o más información.'),
});

export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

    