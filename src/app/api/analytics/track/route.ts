import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const TrackEventSchema = z.object({
  eventType: z.enum([
    'page_view',
    'search_started',
    'onboarding_started',
    'onboarding_completed',
    'recommendation_viewed',
    'product_clicked',
    'product_details_viewed',
    'add_to_cart',
    'start_checkout',
    'purchase_complete',
  ]),
  metadata: z.record(z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  productId: z.string().optional(),
  sellerId: z.string().optional(),
});

/**
 * POST /api/analytics/track
 * Registra eventos de analytics en la base de datos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = TrackEventSchema.parse(body);

    // Obtener información adicional del request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // IP address (considerar usar real IP en producción con headers de proxy)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.ip || 'unknown';

    // Crear evento
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType: validatedData.eventType,
        userId: validatedData.userId,
        sessionId: validatedData.sessionId,
        productId: validatedData.productId,
        sellerId: validatedData.sellerId,
        metadata: validatedData.metadata || {},
        userAgent,
        ipAddress,
        referer,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: event.id,
        tracked: true,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Analytics track error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to track event',
    }, { status: 500 });
  }
}

/**
 * GET /api/analytics/track
 * Para debugging: retorna eventos recientes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const eventType = searchParams.get('eventType');

    const events = await prisma.analyticsEvent.findMany({
      where: eventType ? { eventType } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        eventType: true,
        userId: true,
        sessionId: true,
        productId: true,
        sellerId: true,
        metadata: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        events,
        count: events.length,
      },
    });

  } catch (error: any) {
    console.error('Analytics get error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch events',
    }, { status: 500 });
  }
}
