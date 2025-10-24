import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analytics/funnel
 * Retorna métricas del funnel de conversión
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sellerId = searchParams.get('sellerId'); // Filtro por vendedor

    // Determinar rango de fechas
    let since: Date;
    let until: Date = new Date();

    if (startDate && endDate) {
      since = new Date(startDate);
      until = new Date(endDate);
      until.setHours(23, 59, 59, 999); // Incluir todo el día final
    } else {
      since = new Date();
      since.setDate(since.getDate() - days);
    }

    // Construir where clause con filtro opcional de vendor
    const whereClause: any = {
      createdAt: {
        gte: since,
        lte: until,
      },
    };

    if (sellerId) {
      whereClause.sellerId = sellerId;
    }

    // Obtener conteos por tipo de evento
    const eventCounts = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    // Convertir a objeto para fácil acceso
    const counts: Record<string, number> = {};
    eventCounts.forEach((item) => {
      counts[item.eventType] = item._count.id;
    });

    // Calcular métricas del funnel
    const totalPageViews = counts.page_view || 0;
    const searchStarted = counts.search_started || 0;
    const onboardingStarted = counts.onboarding_started || 0;
    const onboardingCompleted = counts.onboarding_completed || 0;
    const recommendationsViewed = counts.recommendation_viewed || 0;
    const productClicked = counts.product_clicked || 0;
    const productDetailsViewed = counts.product_details_viewed || 0;
    const startCheckout = counts.start_checkout || 0;
    const purchaseComplete = counts.purchase_complete || 0;

    // Calcular tasas de conversión
    const searchConversionRate = totalPageViews > 0 ? (searchStarted / totalPageViews) * 100 : 0;
    const onboardingCompletionRate = onboardingStarted > 0 ? (onboardingCompleted / onboardingStarted) * 100 : 0;
    const productClickRate = recommendationsViewed > 0 ? (productClicked / recommendationsViewed) * 100 : 0;
    const checkoutRate = productClicked > 0 ? (startCheckout / productClicked) * 100 : 0;
    const purchaseRate = startCheckout > 0 ? (purchaseComplete / startCheckout) * 100 : 0;
    const overallConversionRate = totalPageViews > 0 ? (purchaseComplete / totalPageViews) * 100 : 0;

    // Obtener datos de sesiones únicas
    const uniqueSessions = await prisma.analyticsEvent.findMany({
      where: whereClause,
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    // Tiempo promedio de sesión (calculado desde eventos con timeSpent en metadata)
    const sessionTimeEvents = await prisma.analyticsEvent.findMany({
      where: {
        ...whereClause,
        eventType: 'page_view',
      },
      select: {
        metadata: true,
      },
    });

    let totalTimeSpent = 0;
    let timeSpentCount = 0;

    sessionTimeEvents.forEach((event) => {
      const metadata = event.metadata as any;
      if (metadata?.timeSpent && typeof metadata.timeSpent === 'number') {
        totalTimeSpent += metadata.timeSpent;
        timeSpentCount++;
      }
    });

    const avgSessionTime = timeSpentCount > 0 ? Math.floor(totalTimeSpent / timeSpentCount) : 0;

    // Timeline de eventos (agrupados por día)
    let dailyEvents: Array<{date: Date, count: bigint}>;

    if (sellerId) {
      dailyEvents = await prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ${since} AND created_at <= ${until} AND seller_id = ${sellerId}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    } else {
      dailyEvents = await prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= ${since} AND created_at <= ${until}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    }

    return NextResponse.json({
      success: true,
      data: {
        period: {
          days,
          since: since.toISOString(),
        },
        funnel: {
          totalPageViews,
          searchStarted,
          onboardingStarted,
          onboardingCompleted,
          recommendationsViewed,
          productClicked,
          productDetailsViewed,
          startCheckout,
          purchaseComplete,
        },
        conversionRates: {
          searchConversionRate: searchConversionRate.toFixed(2),
          onboardingCompletionRate: onboardingCompletionRate.toFixed(2),
          productClickRate: productClickRate.toFixed(2),
          checkoutRate: checkoutRate.toFixed(2),
          purchaseRate: purchaseRate.toFixed(2),
          overallConversionRate: overallConversionRate.toFixed(2),
        },
        metrics: {
          uniqueSessions: uniqueSessions.length,
          avgSessionTime, // in seconds
          avgSessionTimeFormatted: `${Math.floor(avgSessionTime / 60)}m ${avgSessionTime % 60}s`,
        },
        timeline: dailyEvents.map(item => ({
          date: item.date,
          count: Number(item.count),
        })),
      },
    });

  } catch (error: any) {
    console.error('Analytics funnel error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch analytics',
    }, { status: 500 });
  }
}
