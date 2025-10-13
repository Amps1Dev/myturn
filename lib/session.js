import { serialize, parse } from 'cookie';
import db from './db.js';

const SESSION_COOKIE_NAME = 'myturn-session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';

export class SessionManager {
  // Create a new session
  static createSession(userId) {
    return db.createSession(userId);
  }

  // Get session from cookie
  static getSessionFromCookie(cookieHeader) {
    if (!cookieHeader) return null;

    const cookies = parse(cookieHeader);
    const sessionId = cookies[SESSION_COOKIE_NAME];
    
    if (!sessionId) return null;

    return db.getSession(sessionId);
  }

  // Create session cookie
  static createSessionCookie(sessionId) {
    return serialize(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }

  // Create logout cookie (expires immediately)
  static createLogoutCookie() {
    return serialize(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });
  }

  // Destroy session
  static destroySession(sessionId) {
    return db.deleteSession(sessionId);
  }

  // Get user from session cookie
  static getUserFromSession(cookieHeader) {
    const session = this.getSessionFromCookie(cookieHeader);
    if (!session) return null;

    const user = db.getUserById(session.userId);
    if (!user) {
      // Clean up invalid session
      this.destroySession(session.id);
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default SessionManager;