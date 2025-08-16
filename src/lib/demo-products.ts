import type { ProductRecommendation } from '@/ai/schemas/product-recommendation';

export const demoProducts: ProductRecommendation[] = [
  {
    productName: "Laptop UltraBook Pro X",
    productDescription: "Una laptop potente y ligera, ideal para profesionales y estudiantes que necesitan rendimiento y portabilidad. Con procesador de última generación y pantalla 4K.",
    price: 1499.99,
    qualityScore: 95,
    availability: "En stock",
    justification: "Es la combinación perfecta de potencia y portabilidad, ideal para el trabajo híbrido.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/laptop-pro-x"
  },
  {
    productName: "Smartphone Galaxy Z",
    productDescription: "El último grito en tecnología móvil. Cámara de 108MP, pantalla AMOLED de 120Hz y una batería que dura todo el día.",
    price: 999.00,
    qualityScore: 92,
    availability: "En stock",
    justification: "Ofrece la mejor tecnología de cámara del mercado y un rendimiento excepcional.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/galaxy-z"
  },
  {
    productName: "Auriculares Inalámbricos SoundSurround",
    productDescription: "Sumérgete en tu música con cancelación de ruido activa y hasta 30 horas de reproducción. Calidad de sonido Hi-Fi.",
    price: 199.50,
    qualityScore: 90,
    availability: "En stock",
    justification: "Excelente cancelación de ruido, perfectos para concentrarse o viajar.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/soundsurround-headphones"
  },
  {
    productName: "Smartwatch ActiveFit 2",
    productDescription: "Monitoriza tu actividad física, sueño y notificaciones. Resistente al agua y con GPS integrado. Compatible con iOS y Android.",
    price: 249.00,
    qualityScore: 88,
    availability: "Pocas unidades",
    justification: "Un gran compañero para la actividad física con métricas muy precisas.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/activefit-2"
  },
  {
    productName: "Mochila Ergonómica para Laptop",
    productDescription: "Protege tu equipo con estilo. Múltiples compartimentos, puerto de carga USB y materiales resistentes al agua.",
    price: 89.90,
    qualityScore: 85,
    availability: "En stock",
    justification: "Un complemento ideal para proteger la Laptop Pro X y llevar todos tus gadgets.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/ergonomic-backpack"
  },
  {
    productName: "Cargador Rápido Inalámbrico Qi",
    productDescription: "Carga tu Smartphone Galaxy Z y otros dispositivos compatibles sin cables. Diseño minimalista y elegante.",
    price: 49.99,
    qualityScore: 87,
    availability: "En stock",
    justification: "Simplifica la carga de tus dispositivos y mantiene tu escritorio ordenado.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/qi-charger"
  },
  {
    productName: "Funda Protectora de Silicona para Galaxy Z",
    productDescription: "Protección delgada y duradera para tu smartphone. Material suave al tacto que mejora el agarre.",
    price: 29.99,
    qualityScore: 88,
    availability: "En stock",
    justification: "Protección esencial para mantener tu Galaxy Z como nuevo.",
    imageUrl: "https://placehold.co/600x400.png",
    productUrl: "https://example.com/galaxy-z-case"
  }
];
