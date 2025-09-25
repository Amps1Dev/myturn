import { NextResponse } from 'next/server';
import AuthService from '../../../../lib/auth.js';
import SessionManager from '../../../../lib/session.js';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      userType,
      companyName,
      businessType,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Register user
    const user = await AuthService.registerUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      userType: userType || 'client',
      companyName,
      businessType,
    });

    // Create session
    const session = SessionManager.createSession(user.id);
    const sessionCookie = SessionManager.createSessionCookie(session.id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        companyName: user.companyName,
        businessType: user.businessType,
      },
    });

    // Set session cookie
    response.headers.set('Set-Cookie', sessionCookie);

    return response;
  } catch (err) {
    console.error('Signup error:', err);
    
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: err.message === 'User with this email already exists' ? 409 : 500 }
    );
  }
}