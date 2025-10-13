import { NextResponse } from 'next/server';
import SessionManager from '../../../../lib/session.js';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const user = SessionManager.getUserFromSession(cookieHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
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
  } catch (err) {
    console.err('Get user error:', err);
    
    return NextResponse.json(
      { err: 'Internal server error' },
      { status: 500 }
    );
  }
}