import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().nullable(),
  category: z.string().optional().nullable(),
});

/**
 * GET /api/admin/products/[id]
 * Get a single product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      stock: product.stock,
      imageUrl: product.images[0]?.url || null,
      category: product.category,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 * Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ProductUpdateSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product
    const updateData: any = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.description !== undefined && { description: validatedData.description }),
      ...(validatedData.price && { price: validatedData.price }),
      ...(validatedData.category !== undefined && { category: validatedData.category }),
    };

    // Handle stock update and status change
    if (validatedData.stock !== undefined) {
      updateData.stock = validatedData.stock;
      updateData.status = validatedData.stock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
    }

    // Handle image update
    if (validatedData.imageUrl !== undefined) {
      // Delete existing images
      if (existingProduct.images.length > 0) {
        await prisma.productImage.deleteMany({
          where: { productId: params.id },
        });
      }

      // Add new image if provided
      if (validatedData.imageUrl) {
        await prisma.productImage.create({
          data: {
            productId: params.id,
            url: validatedData.imageUrl,
            position: 0,
          },
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      stock: product.stock,
      imageUrl: product.images[0]?.url || null,
      category: product.category,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (cascade will delete images)
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
