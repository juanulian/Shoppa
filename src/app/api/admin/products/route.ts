import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url().optional().nullable(),
  category: z.string().optional().nullable(),
});

/**
 * GET /api/admin/products
 * List all products (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sellerId = searchParams.get('sellerId');

    const products = await prisma.product.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(sellerId && { sellerProfileId: sellerId }),
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        seller: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to simpler format for admin UI
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      stock: product.stock,
      imageUrl: product.images[0]?.url || null,
      category: product.category,
      seller: product.seller.businessName,
      sellerId: product.sellerProfileId,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    // Get the test seller profile
    const testSeller = await prisma.sellerProfile.findFirst({
      where: {
        businessName: 'Shoppa! Test',
      },
    });

    if (!testSeller) {
      return NextResponse.json(
        { error: 'Test seller not found. Please run seed script.' },
        { status: 404 }
      );
    }

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerProfileId: testSeller.id,
        name: validatedData.name,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        description: validatedData.description || '',
        price: validatedData.price,
        stock: validatedData.stock,
        category: validatedData.category || 'General',
        brand: 'Generic',
        status: validatedData.stock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
        ...(validatedData.imageUrl && {
          images: {
            create: {
              url: validatedData.imageUrl,
              position: 0,
            },
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price.toString()),
        stock: product.stock,
        imageUrl: product.images[0]?.url || null,
        category: product.category,
        createdAt: product.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
