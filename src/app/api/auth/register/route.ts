import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN']).default('BUYER'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = RegisterSchema.parse(body);

    // Register user
    const { user, token } = await registerUser(validatedData as any);

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Registration failed',
    }, { status: 400 });
  }
}
