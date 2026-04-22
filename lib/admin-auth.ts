import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_ACCESS_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE, createSupabaseClientWithToken } from '@/lib/db';

export type AdminUserResult = {
  user: { id: string; email?: string | null } | null;
  accessToken: string | null;
  errorMessage: string | null;
};

export function getAccessTokenFromRequest(request: NextRequest) {
  return (
    request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    null
  );
}

export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value || null;
}

export async function verifyAdminToken(accessToken: string): Promise<AdminUserResult> {
  const client = createSupabaseClientWithToken(accessToken);
  const { data, error } = await client.auth.getUser(accessToken);

  return {
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    accessToken,
    errorMessage: error ? error.message : null,
  };
}

export async function getAdminUserFromRequest(request: NextRequest): Promise<AdminUserResult> {
  const accessToken = getAccessTokenFromRequest(request);
  if (!accessToken) {
    return { user: null, accessToken: null, errorMessage: 'No access token' };
  }

  return verifyAdminToken(accessToken);
}

export function applyAdminSessionCookies(response: NextResponse, session: {
  access_token: string;
  refresh_token: string;
  expires_at?: number | null;
}) {
  const isProduction = process.env.NODE_ENV === 'production';
  const expires = session.expires_at ? new Date(session.expires_at * 1000) : undefined;

  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    expires,
  });

  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, session.refresh_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    expires,
  });
}

export function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
}
