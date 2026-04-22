import { NextResponse } from 'next/server';
import { clearAdminSessionCookies } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Sessão terminada.' }, { status: 200 });
  clearAdminSessionCookies(response);
  return response;
}
