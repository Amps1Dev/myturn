import { NextResponse } from 'next/server';
import AuthService from '../../../../lib/auth.js';
import SessionManager from '../../../../lib/session.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    console.log('Login attempt:', { email, userType }); // Debug log

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login user (without userType check first)
    const user = await AuthService.loginUser(email, password);
    
    console.log('User found:', { userType: user.userType, requestedType: userType }); // Debug log

    // Optional: Check if user type matches (but don't be too strict)
    if (userType && user.userType !== userType) {
      console.log('User type mismatch, but allowing login'); // Debug log
      // Instead of rejecting, let them login and redirect to correct dashboard
    }

    // Create session
    const session = SessionManager.createSession(user.id);
    const sessionCookie = SessionManager.createSessionCookie(session.id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
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
  } catch (err) {  // 
  console.error('Login error:', err);
  return NextResponse.json(
    { error: err.message || 'Internal server error' },  
    { status: err.message === 'Invalid email or password' ? 401 : 500 }
  );
}
}