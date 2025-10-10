/**
 * @fileOverview Defines the Zod schema for a product recommendation.
 */
import { z } from 'zod';

/**
 * Tags predefinidos con su nivel de match correcto.
 *
 * REGLAS:
 * - high (verde): El producto cumple EXCELENTEMENTE esta característica (ej: "Cámara Pro" para iPhone 16 Pro Max)
 * - medium (amarillo): El producto cumple ADECUADAMENTE pero no sobresale (ej: "Batería Decente" para un gama media)
 * - low (rojo): El producto NO cumple bien esta característica pero es un trade-off aceptable
 */
export const PREDEFINED_MATCH_TAGS = {
  // Cámara (icon: camera)
  'Cámara Pro': { icon: 'camera', baseLevel: 'high' },
  'Fotos Excelentes': { icon: 'camera', baseLevel: 'high' },
  'Cámara Buena': { icon: 'camera', baseLevel: 'medium' },
  'Fotos Básicas': { icon: 'camera', baseLevel: 'low' },

  // Batería (icon: battery)
  'Batería Todo el Día': { icon: 'battery', baseLevel: 'high' },
  'Carga Rápida': { icon: 'battery', baseLevel: 'high' },
  'Batería Decente': { icon: 'battery', baseLevel: 'medium' },
  'Batería Justa': { icon: 'battery', baseLevel: 'low' },

  // Velocidad/Rendimiento (icon: zap)
  'Máxima Velocidad': { icon: 'zap', baseLevel: 'high' },
  'Súper Rápido': { icon: 'zap', baseLevel: 'high' },
  'Buen Rendimiento': { icon: 'zap', baseLevel: 'medium' },
  'Rendimiento Básico': { icon: 'zap', baseLevel: 'low' },

  // Precio (icon: dollar-sign)
  'Excelente Precio': { icon: 'dollar-sign', baseLevel: 'high' },
  'Buen Valor': { icon: 'dollar-sign', baseLevel: 'medium' },
  'Precio Elevado': { icon: 'dollar-sign', baseLevel: 'low' },

  // Almacenamiento (icon: hard-drive)
  'Mucho Espacio': { icon: 'hard-drive', baseLevel: 'high' },
  'Espacio Suficiente': { icon: 'hard-drive', baseLevel: 'medium' },
  'Espacio Limitado': { icon: 'hard-drive', baseLevel: 'low' },

  // Pantalla (icon: monitor)
  'Pantalla Premium': { icon: 'monitor', baseLevel: 'high' },
  'Buena Pantalla': { icon: 'monitor', baseLevel: 'medium' },
  'Pantalla Básica': { icon: 'monitor', baseLevel: 'low' },

  // Gaming (icon: gamepad)
  'Gaming Pro': { icon: 'gamepad', baseLevel: 'high' },
  'Juegos Fluidos': { icon: 'gamepad', baseLevel: 'medium' },
  'Gaming Casual': { icon: 'gamepad', baseLevel: 'low' },

  // Trabajo/Productividad (icon: briefcase)
  'Ideal Trabajo': { icon: 'briefcase', baseLevel: 'high' },
  'Bueno para Trabajo': { icon: 'briefcase', baseLevel: 'medium' },

  // Durabilidad (icon: shield)
  'Súper Resistente': { icon: 'shield', baseLevel: 'high' },
  'Resistencia IP68': { icon: 'shield', baseLevel: 'high' },
  'Resistente': { icon: 'shield', baseLevel: 'medium' },

  // Conectividad (icon: wifi)
  '5G Ultrarrápido': { icon: 'wifi', baseLevel: 'high' },
  'Buena Conectividad': { icon: 'wifi', baseLevel: 'medium' },
} as const;

export type PredefinedMatchTag = keyof typeof PREDEFINED_MATCH_TAGS;

// Schema base (el que usa la AI)
const BaseProductRecommendationSchema = z.object({
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
    tag: z.enum([
      // Cámara
      'Cámara Pro', 'Fotos Excelentes', 'Cámara Buena', 'Fotos Básicas',
      // Batería
      'Batería Todo el Día', 'Carga Rápida', 'Batería Decente', 'Batería Justa',
      // Velocidad
      'Máxima Velocidad', 'Súper Rápido', 'Buen Rendimiento', 'Rendimiento Básico',
      // Precio
      'Excelente Precio', 'Buen Valor', 'Precio Elevado',
      // Almacenamiento
      'Mucho Espacio', 'Espacio Suficiente', 'Espacio Limitado',
      // Pantalla
      'Pantalla Premium', 'Buena Pantalla', 'Pantalla Básica',
      // Gaming
      'Gaming Pro', 'Juegos Fluidos', 'Gaming Casual',
      // Trabajo
      'Ideal Trabajo', 'Bueno para Trabajo',
      // Durabilidad
      'Súper Resistente', 'Resistencia IP68', 'Resistente',
      // Conectividad
      '5G Ultrarrápido', 'Buena Conectividad',
    ]).describe('Tag predefinido que describe una característica clave. EL TAG YA DEFINE EL NIVEL: "Máxima Velocidad"=high, "Buen Rendimiento"=medium, "Rendimiento Básico"=low.'),
    level: z.enum(['high', 'medium', 'low']).describe('DEBE coincidir con el tag: "Máxima Velocidad"/"Súper Rápido"/"Cámara Pro"/"Fotos Excelentes"/"Batería Todo el Día"/"Carga Rápida"/"Excelente Precio"/"Mucho Espacio"/"Pantalla Premium"/"Gaming Pro"/"Ideal Trabajo"/"Súper Resistente"/"Resistencia IP68"/"5G Ultrarrápido" = SIEMPRE "high". "Buen Rendimiento"/"Cámara Buena"/"Batería Decente"/"Buen Valor"/"Espacio Suficiente"/"Buena Pantalla"/"Juegos Fluidos"/"Bueno para Trabajo"/"Resistente"/"Buena Conectividad" = SIEMPRE "medium". "Rendimiento Básico"/"Fotos Básicas"/"Batería Justa"/"Precio Elevado"/"Espacio Limitado"/"Pantalla Básica"/"Gaming Casual" = SIEMPRE "low".'),
    icon: z.enum(['camera', 'battery', 'zap', 'dollar-sign', 'hard-drive', 'monitor', 'gamepad', 'briefcase', 'shield', 'wifi', 'smartphone']).describe('Icono automático según el tag seleccionado. NO inventar, usar el icono correspondiente al tag.')
  })).min(2).max(4).describe('Array de 2-4 tags predefinidos. CRÍTICO: El nivel (color) está IMPLÍCITO en el tag. Si elegís "Máxima Velocidad", el nivel DEBE ser "high". Si elegís "Buen Rendimiento", el nivel DEBE ser "medium".'),
});

// Validación post-AI para corregir inconsistencias
export const ProductRecommendationSchema = BaseProductRecommendationSchema.transform((data) => {
  // Auto-corregir nivel según el tag para eliminar inconsistencias
  const correctedTags = data.matchTags.map(matchTag => {
    const tagInfo = PREDEFINED_MATCH_TAGS[matchTag.tag as PredefinedMatchTag];
    if (tagInfo) {
      // Corregir icono y nivel según definición
      return {
        ...matchTag,
        icon: tagInfo.icon,
        level: tagInfo.baseLevel,
      };
    }
    return matchTag;
  });

  return {
    ...data,
    matchTags: correctedTags,
  };
});

export type ProductRecommendation = z.infer<typeof BaseProductRecommendationSchema>;
