import { NextResponse } from 'next/server';
import SessionManager from '../../../../lib/session.js';

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const session = SessionManager.getSessionFromCookie(cookieHeader);

    if (session) {
      // Destroy the session
      SessionManager.destroySession(session.id);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear session cookie
    const logoutCookie = SessionManager.createLogoutCookie();
    response.headers.set('Set-Cookie', logoutCookie);

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    
    // Even if there's an error, we should still clear the cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    const logoutCookie = SessionManager.createLogoutCookie();
    response.headers.set('Set-Cookie', logoutCookie);

    return response;
  }
}