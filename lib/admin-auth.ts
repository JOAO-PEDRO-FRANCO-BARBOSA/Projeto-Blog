import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_ACCESS_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE, createSupabaseClientWithToken } from '@/lib/db';

export type AdminAuthStatus = 'authenticated' | 'unauthorized' | 'auth_failed';

export type AdminUserResult = {
  status: AdminAuthStatus;
  user: { id: string; email?: string | null } | null;
  accessToken: string | null;
  errorMessage: string | null;
};

type RefreshedAdminSessionResult = AdminUserResult & {
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at?: number | null;
  };
};

export function getAccessTokenFromRequest(request: NextRequest) {
  return (
    request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    null
  );
}

export function getRefreshTokenFromRequest(request: NextRequest) {
  return request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value || null;
}

export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value || null;
}

export async function getRefreshTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value || null;
}

function isSupabaseCommunicationError(message: string | null) {
  if (!message) {
    return false;
  }

  return /fetch failed|network|timeout|timed out|enotfound|econnrefused|connection/i.test(message);
}

export async function verifyAdminToken(accessToken: string): Promise<AdminUserResult> {
  try {
    const client = createSupabaseClientWithToken(accessToken);
    const { data, error } = await client.auth.getUser(accessToken);

    if (error) {
      return {
        status: isSupabaseCommunicationError(error.message) ? 'auth_failed' : 'unauthorized',
        user: null,
        accessToken,
        errorMessage: error.message,
      };
    }

    if (!data.user) {
      return {
        status: 'unauthorized',
        user: null,
        accessToken,
        errorMessage: 'Invalid session',
      };
    }

    return {
      status: 'authenticated',
      user: { id: data.user.id, email: data.user.email },
      accessToken,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: 'auth_failed',
      user: null,
      accessToken,
      errorMessage: error instanceof Error ? error.message : 'Supabase communication failed',
    };
  }
}

async function refreshAdminSession(refreshToken: string): Promise<RefreshedAdminSessionResult> {
  try {
    const client = createSupabaseClientWithToken();
    const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });

    if (error) {
      return {
        status: isSupabaseCommunicationError(error.message) ? 'auth_failed' : 'unauthorized',
        user: null,
        accessToken: null,
        errorMessage: error.message,
      };
    }

    if (!data.session || !data.user) {
      return {
        status: 'unauthorized',
        user: null,
        accessToken: null,
        errorMessage: 'Invalid refresh session',
      };
    }

    return {
      status: 'authenticated',
      user: { id: data.user.id, email: data.user.email },
      accessToken: data.session.access_token,
      errorMessage: null,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token || refreshToken,
        expires_at: data.session.expires_at,
      },
    };
  } catch (error) {
    return {
      status: 'auth_failed',
      user: null,
      accessToken: null,
      errorMessage: error instanceof Error ? error.message : 'Supabase communication failed',
    };
  }
}

export async function getAdminUserFromCookies(): Promise<AdminUserResult> {
  const accessToken = await getAccessTokenFromCookies();

  if (accessToken) {
    const verified = await verifyAdminToken(accessToken);
    if (verified.status === 'authenticated' || verified.status === 'auth_failed') {
      return verified;
    }
  }

  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) {
    return { status: 'unauthorized', user: null, accessToken: null, errorMessage: 'No session token' };
  }

  const refreshed = await refreshAdminSession(refreshToken);

  return {
    status: refreshed.status,
    user: refreshed.user,
    accessToken: refreshed.accessToken,
    errorMessage: refreshed.errorMessage,
  };
}

export async function getAdminUserFromRequest(
  request: NextRequest,
  response?: NextResponse
): Promise<AdminUserResult> {
  const accessToken = getAccessTokenFromRequest(request);

  if (accessToken) {
    const verified = await verifyAdminToken(accessToken);
    if (verified.status === 'authenticated' || verified.status === 'auth_failed') {
      return verified;
    }
  }

  const refreshToken = getRefreshTokenFromRequest(request);
  if (!refreshToken) {
    return { status: 'unauthorized', user: null, accessToken: null, errorMessage: 'No session token' };
  }

  const refreshed = await refreshAdminSession(refreshToken);

  if (refreshed.status === 'authenticated' && refreshed.session && response) {
    applyAdminSessionCookies(response, refreshed.session);
  }

  return {
    status: refreshed.status,
    user: refreshed.user,
    accessToken: refreshed.accessToken,
    errorMessage: refreshed.errorMessage,
  };
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
