/**
 * Cliente de Analytics para tracking de eventos
 */

type EventType =
  | 'page_view'
  | 'search_started'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'recommendation_viewed'
  | 'product_clicked'
  | 'product_details_viewed'
  | 'add_to_cart'
  | 'start_checkout'
  | 'purchase_complete';

interface TrackEventParams {
  eventType: EventType;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  productId?: string;
  sellerId?: string;
}

/**
 * Genera o recupera un session ID único del navegador
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';

  let sessionId = sessionStorage.getItem('shoppa_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('shoppa_session_id', sessionId);
  }

  return sessionId;
}

/**
 * Envía evento de analytics al backend
 */
export async function trackEvent(params: TrackEventParams): Promise<boolean> {
  try {
    // Agregar sessionId automáticamente si no se proporciona
    const sessionId = params.sessionId || getSessionId();

    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        sessionId,
      }),
    });

    if (!response.ok) {
      console.error('Analytics tracking failed:', await response.text());
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return false;
  }
}

/**
 * Shortcuts para eventos comunes
 */
export const analytics = {
  pageView: (page: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'page_view',
      metadata: { page, ...metadata },
    }),

  searchStarted: (query: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'search_started',
      metadata: { query, ...metadata },
    }),

  onboardingStarted: (metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'onboarding_started',
      metadata,
    }),

  onboardingCompleted: (metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'onboarding_completed',
      metadata,
    }),

  recommendationViewed: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'recommendation_viewed',
      productId,
      sellerId,
      metadata,
    }),

  productClicked: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'product_clicked',
      productId,
      sellerId,
      metadata,
    }),

  productDetailsViewed: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'product_details_viewed',
      productId,
      sellerId,
      metadata,
    }),

  addToCart: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'add_to_cart',
      productId,
      sellerId,
      metadata,
    }),

  startCheckout: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'start_checkout',
      productId,
      sellerId,
      metadata,
    }),

  purchaseComplete: (productId: string, sellerId?: string, metadata?: Record<string, any>) =>
    trackEvent({
      eventType: 'purchase_complete',
      productId,
      sellerId,
      metadata,
    }),
};

/**
 * Hook para medir tiempo de permanencia en página
 */
export function usePageTimeTracking(pageName: string) {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();

  // Enviar evento de page view
  analytics.pageView(pageName);

  // Al salir de la página, registrar tiempo
  const handleBeforeUnload = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // segundos

    // Usar sendBeacon para garantizar envío incluso al salir
    const sessionId = getSessionId();
    const payload = JSON.stringify({
      eventType: 'page_view',
      sessionId,
      metadata: {
        page: pageName,
        timeSpent,
        exitEvent: true,
      },
    });

    navigator.sendBeacon('/api/analytics/track', payload);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
