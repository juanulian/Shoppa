import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CheckoutDataSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number().int().positive(),
  productImage: z.string().optional(),
  buyerName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(1),
  buyerAddress: z.string().min(1),
  buyerCity: z.string().min(1),
  buyerProvince: z.string().min(1),
  buyerPostalCode: z.string().min(1),
  buyerNotes: z.string().optional(),
});

/**
 * POST /api/checkout
 * Save checkout data before redirecting to Mercado Pago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CheckoutDataSchema.parse(body);

    // Save checkout data
    const checkoutData = await prisma.checkoutData.create({
      data: {
        productId: validatedData.productId,
        productName: validatedData.productName,
        productPrice: validatedData.productPrice,
        productImage: validatedData.productImage || null,
        buyerName: validatedData.buyerName,
        buyerEmail: validatedData.buyerEmail,
        buyerPhone: validatedData.buyerPhone,
        buyerAddress: validatedData.buyerAddress,
        buyerCity: validatedData.buyerCity,
        buyerProvince: validatedData.buyerProvince,
        buyerPostalCode: validatedData.buyerPostalCode,
        buyerNotes: validatedData.buyerNotes || null,
        paymentStatus: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        checkoutId: checkoutData.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving checkout data:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to save checkout data' },
      { status: 500 }
    );
  }
}
