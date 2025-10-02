import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const SellerOnboardingSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['individual', 'company', 'cooperative']),
  taxId: z.string().min(11, 'Valid CUIT/CUIL is required'), // Argentine CUIT
  businessAddress: z.string().min(10, 'Business address is required'),
  businessPhone: z.string().min(10, 'Business phone is required'),
  businessEmail: z.string().email('Valid business email is required'),

  // Banking (optional at first, required for payouts)
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountType: z.enum(['savings', 'checking']).optional(),
});

/**
 * POST /api/seller/onboarding
 * Complete seller onboarding and create seller profile
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await authenticateRequest(authHeader);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    // Check if user has SELLER role
    if (!hasRole(user, 'SELLER')) {
      return NextResponse.json({
        success: false,
        error: 'User must be registered as a seller',
      }, { status: 403 });
    }

    // Check if seller profile already exists
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json({
        success: false,
        error: 'Seller profile already exists',
      }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = SellerOnboardingSchema.parse(body);

    // Check if taxId is already registered
    const existingTaxId = await prisma.sellerProfile.findUnique({
      where: { taxId: validatedData.taxId },
    });

    if (existingTaxId) {
      return NextResponse.json({
        success: false,
        error: 'This tax ID is already registered',
      }, { status: 400 });
    }

    // Create seller profile
    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName: validatedData.businessName,
        businessType: validatedData.businessType,
        taxId: validatedData.taxId,
        businessAddress: validatedData.businessAddress,
        businessPhone: validatedData.businessPhone,
        businessEmail: validatedData.businessEmail,
        bankName: validatedData.bankName,
        bankAccountNumber: validatedData.bankAccountNumber,
        bankAccountType: validatedData.bankAccountType,
        status: 'PENDING_VERIFICATION',
        tier: 'BASIC',
      },
    });

    // TODO: Send verification email to admin
    // TODO: Create Stripe Connect account

    return NextResponse.json({
      success: true,
      data: { sellerProfile },
      message: 'Seller profile created. Pending verification.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Seller onboarding error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Onboarding failed',
    }, { status: 500 });
  }
}

/**
 * GET /api/seller/onboarding
 * Get seller onboarding status
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await authenticateRequest(authHeader);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    if (!hasRole(user, 'SELLER')) {
      return NextResponse.json({
        success: false,
        error: 'User must be a seller',
      }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({
        success: true,
        data: {
          onboarded: false,
          message: 'Seller profile not created yet',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        onboarded: true,
        sellerProfile,
      },
    });

  } catch (error: any) {
    console.error('Get onboarding status error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get onboarding status',
    }, { status: 500 });
  }
}
