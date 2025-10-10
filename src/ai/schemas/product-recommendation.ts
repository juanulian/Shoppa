/**
 * @fileOverview Defines the Zod schema for a product recommendation.
 */
import { z } from 'zod';

export const ProductRecommendationSchema = z.object({
  productName: z.string().describe('El nombre del celular (ej. "Galaxy S25 Ultra").'),
  productDescription: z.string().describe('Una descripción atractiva centrada en beneficios reales para el usuario, usando lenguaje claro y no técnico.'),
  price: z.string().describe('El precio o rango de precio estimado del celular.'),
  qualityScore: z.number().min(70).max(98).describe('Un puntaje de calidad basado en gama y especificaciones (70-98). Mayor puntaje indica mejor calidad/valor.'),
  availability: z.string().describe('La disponibilidad del producto (siempre "En stock").'),
  justification: z.string().describe('Justificación persuasiva que conecta características específicas del producto con las necesidades declaradas del usuario. Debe generar confianza y reducir dudas de compra.'),
  imageUrl: z.string().describe('Una URL a una imagen del producto.'),
  productUrl: z.string().describe('URL de búsqueda en Google para explorar el producto y encontrar opciones de compra.'),
  matchPercentage: z.number().min(65).max(98).describe('Porcentaje de compatibilidad del producto con las necesidades del usuario (65-98%).'),
  matchTags: z.array(z.object({
    tag: z.string().describe('Tag de 1-3 palabras que sintetiza una característica clave que coincide con las necesidades del usuario.'),
    level: z.enum(['high', 'medium', 'low']).describe('Nivel de match: high (verde), medium (amarillo), low (rojo).'),
    icon: z.enum(['camera', 'battery', 'zap', 'dollar-sign', 'hard-drive', 'monitor', 'gamepad', 'briefcase', 'shield', 'wifi', 'smartphone']).describe('Icono representativo del tag: camera (cámara), battery (batería), zap (velocidad), dollar-sign (precio), hard-drive (almacenamiento), monitor (pantalla), gamepad (gaming), briefcase (trabajo), shield (resistencia), wifi (conectividad), smartphone (general).')
  })).min(2).max(4).describe('Array de 2-4 tags que resumen los puntos clave de coincidencia con el usuario.'),
});

export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;
