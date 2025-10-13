import { NextResponse } from 'next/server';
import SessionManager from './lib/session.js';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/client/dashboard', '/company/dashboard'];
  const authRoutes = ['/login', '/signup'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Get user from session
  const cookieHeader = request.headers.get('cookie');
  const user = SessionManager.getUserFromSession(cookieHeader);

  if (isProtectedRoute) {
    // If accessing protected route without authentication, redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is accessing the correct dashboard type
    if (pathname.startsWith('/client/dashboard') && user.userType !== 'client') {
      return NextResponse.redirect(new URL('/company/dashboard', request.url));
    }
    
    if (pathname.startsWith('/company/dashboard') && user.userType !== 'company') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url));
    }
  }

  if (isAuthRoute && user) {
    // If user is already authenticated and trying to access auth pages, redirect to dashboard
    const dashboardUrl = user.userType === 'client' ? '/client/dashboard' : '/company/dashboard';
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};