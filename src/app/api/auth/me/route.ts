import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

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

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: { user: userWithoutPassword },
    });

  } catch (error: any) {
    console.error('Get user error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get user',
    }, { status: 500 });
  }
}
