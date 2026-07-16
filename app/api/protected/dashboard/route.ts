import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { userRepository } from '../../repository/userRepo';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Honest 401 Unauthorized
    if (!token) {
      return NextResponse.json({ error: 'Access denied. Please log in.' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

      // Identify exactly WHO is calling the endpoint
      const dbUser = await userRepository.findUserById(decoded.userId);

      // Honest 403 Forbidden if user context doesn't match db records
      if (!dbUser) {
        return NextResponse.json({ error: 'User context not found.' }, { status: 403 });
      }

      return NextResponse.json({
        message: 'Welcome to your isolation dashboard!',
        user: {
          id: dbUser.id,
          email: dbUser.email,
          joined: dbUser.created_at,
        },
        secretCompanyData: 'The core algorithm code is located at repo-v2-main-cluster.',
      });
    } catch (err) {
      return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 403 });
    }
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}