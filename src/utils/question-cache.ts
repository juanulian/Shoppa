'use client';

// Sistema de caché simple para preguntas comunes basado en patrones de respuesta

interface CachedQuestion {
  patterns: string[];
  questions: string[];
  lastUsed: number;
}

class QuestionCache {
  private cache: Map<string, CachedQuestion> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  constructor() {
    this.initializeCommonQuestions();
  }

  private initializeCommonQuestions() {
    // Preguntas comunes basadas en respuestas típicas
    const commonQuestions: Record<string, CachedQuestion> = {
      'photography_social': {
        patterns: ['foto', 'instagram', 'red social', 'selfie', 'cámara', 'imagen'],
        questions: [
          "¿Qué tipo de fotos tomas más: retratos y selfies, paisajes, o fotos de cerca/macro?",
          "¿Prefieres una cámara que sea excelente en automático o te gusta controlar ajustes manuales?",
          "¿Cuál es tu rango de presupuesto para un celular con buena cámara? (Ej: hasta $400.000, $500.000-800.000, más de $800.000)"
        ],
        lastUsed: Date.now()
      },
      'gaming_performance': {
        patterns: ['juego', 'gaming', 'game', 'videojuego', 'jugar', 'gráfico'],
        questions: [
          "¿Qué tipo de juegos sueles jugar? (Ej: PUBG/Call of Duty, League of Legends, juegos casuales como Candy Crush)",
          "¿Es más importante para ti los gráficos al máximo o que el celular no se caliente mucho?",
          "¿Cuántas horas al día aproximadamente juegas en el celular?"
        ],
        lastUsed: Date.now()
      },
      'work_productivity': {
        patterns: ['trabajo', 'oficina', 'email', 'productividad', 'negocio', 'profesional'],
        questions: [
          "¿Qué aplicaciones de trabajo usas más? (Ej: Office, Zoom/Teams, WhatsApp Business, apps bancarias)",
          "¿Necesitas que dure todo el día laboral sin cargar o puedes cargarlo a medio día?",
          "¿Es importante para ti tener una pantalla grande para leer documentos o prefieres algo más compacto?"
        ],
        lastUsed: Date.now()
      },
      'basic_communication': {
        patterns: ['básico', 'simple', 'llamada', 'mensaje', 'whatsapp', 'comunicación'],
        questions: [
          "¿Además de llamadas y mensajes, qué otras apps usas diariamente? (Ej: YouTube, Facebook, navegación GPS)",
          "¿Prefieres un celular fácil de usar y duradero, o no te importa aprender funciones nuevas?",
          "¿Cuál es tu presupuesto máximo? (Ej: hasta $300.000, $300.000-500.000)"
        ],
        lastUsed: Date.now()
      }
    };

    Object.entries(commonQuestions).forEach(([key, value]) => {
      this.cache.set(key, value);
    });
  }

  public findCachedQuestions(userAnswer: string): string[] {
    const lowerAnswer = userAnswer.toLowerCase();

    for (const [key, cached] of this.cache.entries()) {
      // Verificar si el caché no ha expirado
      if (Date.now() - cached.lastUsed > this.CACHE_DURATION) {
        continue;
      }

      // Buscar patrones que coincidan
      const hasMatch = cached.patterns.some(pattern =>
        lowerAnswer.includes(pattern.toLowerCase())
      );

      if (hasMatch) {
        // Actualizar última vez usado
        cached.lastUsed = Date.now();
        // Devolver preguntas aleatorias del cache
        const shuffled = [...cached.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(2, shuffled.length));
      }
    }

    return [];
  }

  public addToCache(patterns: string[], questions: string[], category?: string) {
    const key = category || `custom_${Date.now()}`;
    this.cache.set(key, {
      patterns,
      questions,
      lastUsed: Date.now()
    });
  }

  public clearExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.lastUsed > this.CACHE_DURATION) {
        // No eliminar preguntas comunes inicializadas, solo las custom
        if (!key.includes('photography_') && !key.includes('gaming_') &&
            !key.includes('work_') && !key.includes('basic_')) {
          this.cache.delete(key);
        }
      }
    }
  }
}

// Instancia singleton
export const questionCache = new QuestionCache();