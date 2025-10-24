import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analytics/products
 * Retorna analytics por producto (más clickeados, más vistos, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Obtener productos más clickeados
    const productClicks = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        eventType: 'product_clicked',
        productId: { not: null },
        createdAt: {
          gte: since,
          lte: until,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    // Obtener detalles de cada producto (nombre, precio desde metadata)
    const topClickedProducts = await Promise.all(
      productClicks.map(async (item) => {
        // Buscar evento más reciente para obtener metadata
        const recentEvent = await prisma.analyticsEvent.findFirst({
          where: {
            productId: item.productId,
            eventType: 'product_clicked',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            metadata: true,
          },
        });

        const metadata = recentEvent?.metadata as any;

        return {
          productId: item.productId,
          productName: metadata?.productName || item.productId,
          price: metadata?.productPrice || 'N/A',
          clicks: item._count.id,
        };
      })
    );

    // Productos con más vistas de detalles
    const productDetailsViews = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        eventType: 'product_details_viewed',
        productId: { not: null },
        createdAt: {
          gte: since,
          lte: until,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    const topViewedProducts = await Promise.all(
      productDetailsViews.map(async (item) => {
        const recentEvent = await prisma.analyticsEvent.findFirst({
          where: {
            productId: item.productId,
            eventType: 'product_details_viewed',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            metadata: true,
          },
        });

        const metadata = recentEvent?.metadata as any;

        return {
          productId: item.productId,
          productName: metadata?.productName || item.productId,
          price: metadata?.price || 'N/A',
          matchPercentage: metadata?.matchPercentage,
          views: item._count.id,
        };
      })
    );

    // Productos que más llegan a checkout
    const productCheckouts = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        eventType: 'start_checkout',
        productId: { not: null },
        createdAt: {
          gte: since,
          lte: until,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    const topCheckoutProducts = await Promise.all(
      productCheckouts.map(async (item) => {
        const recentEvent = await prisma.analyticsEvent.findFirst({
          where: {
            productId: item.productId,
            eventType: 'start_checkout',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            metadata: true,
          },
        });

        const metadata = recentEvent?.metadata as any;

        return {
          productId: item.productId,
          productName: metadata?.productName || item.productId,
          price: metadata?.productPrice || 'N/A',
          checkouts: item._count.id,
        };
      })
    );

    // Calcular tasa de conversión por producto (clicks → checkout)
    const productConversionRates = topClickedProducts.map((product) => {
      const checkoutData = topCheckoutProducts.find(
        (p) => p.productId === product.productId
      );
      const checkouts = checkoutData?.checkouts || 0;
      const conversionRate = product.clicks > 0 ? (checkouts / product.clicks) * 100 : 0;

      return {
        ...product,
        checkouts,
        conversionRate: conversionRate.toFixed(2),
      };
    });

    // Recomendaciones más vistas (para entender qué productos generó el AI)
    const recommendationsViewed = await prisma.analyticsEvent.groupBy({
      by: ['productId'],
      where: {
        eventType: 'recommendation_viewed',
        productId: { not: null },
        createdAt: {
          gte: since,
          lte: until,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 20,
    });

    const topRecommendedProducts = await Promise.all(
      recommendationsViewed.map(async (item) => {
        const recentEvent = await prisma.analyticsEvent.findFirst({
          where: {
            productId: item.productId,
            eventType: 'recommendation_viewed',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            metadata: true,
          },
        });

        const metadata = recentEvent?.metadata as any;

        return {
          productId: item.productId,
          productName: item.productId,
          position: metadata?.position,
          generationTime: metadata?.generationTime,
          timesRecommended: item._count.id,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        period: {
          since: since.toISOString(),
          until: until.toISOString(),
        },
        topClicked: productConversionRates,
        topViewed: topViewedProducts,
        topCheckout: topCheckoutProducts,
        topRecommended: topRecommendedProducts,
      },
    });
  } catch (error: any) {
    console.error('Product analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch product analytics',
      },
      { status: 500 }
    );
  }
}
