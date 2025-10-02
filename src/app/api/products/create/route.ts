import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';

const CreateProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().optional(),
  condition: z.enum(['NEW', 'REFURBISHED', 'USED_EXCELLENT', 'USED_GOOD', 'USED_FAIR']).default('NEW'),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    position: z.number().int().nonnegative().default(0),
  })).min(1, 'At least one image is required'),
  videos: z.array(z.object({
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    duration: z.number().int().positive().optional(),
    position: z.number().int().nonnegative().default(0),
  })).optional(),
  status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT'),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await authenticateRequest(authHeader);

    if (!user || !hasRole(user, 'SELLER')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Only sellers can create products.',
      }, { status: 401 });
    }

    // Get seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({
        success: false,
        error: 'Seller profile not found. Complete onboarding first.',
      }, { status: 400 });
    }

    if (sellerProfile.status !== 'VERIFIED') {
      return NextResponse.json({
        success: false,
        error: 'Seller account is not verified yet.',
      }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateProductSchema.parse(body);

    // Generate unique slug
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create product with images and videos
    const product = await prisma.product.create({
      data: {
        sellerProfileId: sellerProfile.id,
        name: validatedData.name,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        compareAtPrice: validatedData.compareAtPrice,
        stock: validatedData.stock,
        sku: validatedData.sku,
        category: validatedData.category,
        subcategory: validatedData.subcategory,
        brand: validatedData.brand,
        model: validatedData.model,
        condition: validatedData.condition,
        specifications: validatedData.specifications || {},
        status: validatedData.status,
        publishedAt: validatedData.status === 'ACTIVE' ? new Date() : null,
        images: {
          create: validatedData.images,
        },
        videos: validatedData.videos ? {
          create: validatedData.videos,
        } : undefined,
      },
      include: {
        images: true,
        videos: true,
        seller: {
          select: {
            businessName: true,
            averageRating: true,
            totalReviews: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { product },
      message: `Product ${validatedData.status === 'ACTIVE' ? 'published' : 'saved as draft'} successfully`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create product error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create product',
    }, { status: 500 });
  }
}
