import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userRepository } from '../../repository/userRepo';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Hash the plain-text password using bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const newUser = await userRepository.createUser(email, passwordHash);
      return NextResponse.json(
        { message: 'User registered successfully!', userId: newUser.id }, 
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle existing email conflict safely
      if (dbError.code === '23505') { 
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}