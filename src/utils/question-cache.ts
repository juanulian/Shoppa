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
        patterns: ['foto', 'instagram', 'red social', 'selfie', 'camara', 'imagen'],
        questions: [
          "Que tipo de fotos tomas mas: retratos y selfies, paisajes, o fotos de cerca/macro?",
          "Prefieres una camara que sea excelente en automatico o te gusta controlar ajustes manuales?",
          "Cual es tu rango de presupuesto para un celular con buena camara? (Ej: hasta $400.000, $500.000-800.000, mas de $800.000)"
        ],
        lastUsed: Date.now()
      },
      'gaming_performance': {
        patterns: ['juego', 'gaming', 'game', 'videojuego', 'jugar', 'grafico'],
        questions: [
          "Que tipo de juegos sueles jugar? (Ej: PUBG/Call of Duty, League of Legends, juegos casuales como Candy Crush)",
          "Es mas importante para ti los graficos al maximo o que el celular no se caliente mucho?",
          "Cuantas horas al dia aproximadamente juegas en el celular?"
        ],
        lastUsed: Date.now()
      },
      'work_productivity': {
        patterns: ['trabajo', 'oficina', 'email', 'productividad', 'negocio', 'profesional'],
        questions: [
          "Que aplicaciones de trabajo usas mas? (Ej: Office, Zoom/Teams, WhatsApp Business, apps bancarias)",
          "Necesitas que dure todo el dia laboral sin cargar o puedes cargarlo a medio dia?",
          "Es importante para ti tener una pantalla grande para leer documentos o prefieres algo mas compacto?"
        ],
        lastUsed: Date.now()
      },
      'basic_communication': {
        patterns: ['basico', 'simple', 'llamada', 'mensaje', 'whatsapp', 'comunicacion'],
        questions: [
          "Ademas de llamadas y mensajes, que otras apps usas diariamente? (Ej: YouTube, Facebook, navegacion GPS)",
          "Prefieres un celular facil de usar y duradero, o no te importa aprender funciones nuevas?",
          "Cual es tu presupuesto maximo? (Ej: hasta $300.000, $300.000-500.000)"
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