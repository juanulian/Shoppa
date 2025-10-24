import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analytics/vendors
 * Retorna lista de vendors que tienen eventos registrados
 */
export async function GET() {
  try {
    // Obtener vendors únicos de analytics events
    const vendors = await prisma.analyticsEvent.findMany({
      where: {
        sellerId: {
          not: null,
        },
      },
      select: {
        sellerId: true,
      },
      distinct: ['sellerId'],
    });

    // Contar eventos por vendor
    const vendorsWithCounts = await Promise.all(
      vendors.map(async (v) => {
        const count = await prisma.analyticsEvent.count({
          where: {
            sellerId: v.sellerId,
          },
        });

        // Intentar obtener nombre del vendor del seller profile
        let vendorName = v.sellerId;
        try {
          const seller = await prisma.sellerProfile.findUnique({
            where: { id: v.sellerId! },
            select: {
              businessName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          });

          if (seller?.businessName) {
            vendorName = seller.businessName;
          } else if (seller?.user.email) {
            vendorName = seller.user.email;
          }
        } catch (error) {
          // Si no existe el seller profile, usar el ID
        }

        return {
          id: v.sellerId,
          name: vendorName,
          eventCount: count,
        };
      })
    );

    // Ordenar por cantidad de eventos (descendente)
    vendorsWithCounts.sort((a, b) => b.eventCount - a.eventCount);

    return NextResponse.json({
      success: true,
      data: {
        vendors: vendorsWithCounts,
        total: vendorsWithCounts.length,
      },
    });
  } catch (error: any) {
    console.error('Vendors analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch vendors',
      },
      { status: 500 }
    );
  }
}
