import { NextResponse } from 'next/server';
import db from '../../../../lib/db.js';

export async function GET(request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const users = db.getAllUsers();
  const sessions = db.getAllSessions();

  return NextResponse.json({
    users: users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      companyName: user.companyName,
      businessType: user.businessType,
    })),
    sessions: sessions.length,
  });
}